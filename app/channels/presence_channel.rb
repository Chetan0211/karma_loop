class PresenceChannel < ApplicationCable::Channel
  periodically :heartbeat, every: 30.seconds

  def subscribed
    @presence_id = SecureRandom.uuid
    Presence.connect(current_user, @presence_id)
  end

  def unsubscribed
    Presence.disconnect(current_user, @presence_id)
  end

  private

  def heartbeat
    Presence.heartbeat(current_user, @presence_id)
  end
end
