# Tracks which users have the app open. Each open tab is a member of a Redis sorted set per user,
# scored by its last heartbeat, so tabs lost without a disconnect (crash, deploy) expire on their own.
class Presence
  TIMEOUT = 75.seconds
  LAST_SEEN_INTERVAL = 1.minute

  class << self
    def connect(user, connection_id)
      was_online = online?(user)
      touch(user, connection_id)
      broadcast(user, online: true) unless was_online
    end

    def heartbeat(user, connection_id)
      touch(user, connection_id)
      # Keeps last_seen_at roughly current in case the tab is lost without a disconnect
      if user.last_seen_at.nil? || user.last_seen_at < LAST_SEEN_INTERVAL.ago
        user.update_column(:last_seen_at, Time.current)
      end
    end

    def disconnect(user, connection_id)
      REDIS_POOL.with { |redis| redis.zrem(key(user), connection_id) }
      return if online?(user)

      user.update_column(:last_seen_at, Time.current)
      broadcast(user, online: false)
    end

    def online?(user)
      REDIS_POOL.with do |redis|
        redis.zremrangebyscore(key(user), "-inf", TIMEOUT.ago.to_f)
        redis.zcard(key(user)).positive?
      end
    end

    private

    def touch(user, connection_id)
      REDIS_POOL.with do |redis|
        redis.zadd(key(user), Time.current.to_f, connection_id)
        redis.expire(key(user), TIMEOUT.to_i * 2)
      end
    end

    def broadcast(user, online:)
      %w[presence_status presence_dot].each do |partial|
        Turbo::StreamsChannel.broadcast_replace_to(
          "presence_#{user.id}",
          target: "#{partial}_#{user.id}",
          partial: "chat/#{partial}",
          locals: { user: user, online: online }
        )
      end
    end

    def key(user)
      "presence:#{user.id}"
    end
  end
end
