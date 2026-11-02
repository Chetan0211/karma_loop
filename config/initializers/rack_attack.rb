class Rack::Attack
  Rack::Attack.cache.store = ActiveSupport::Cache::RedisCacheStore.new(
    url: ENV.fetch("REDIS_URL") { "redis://localhost:6379/1" },
    namespace: "karma_loop:rack_attack"
  )

  # Login: per IP, and per email so a single account can't be brute-forced from many IPs
  throttle("logins/ip", limit: 10, period: 1.minute) do |req|
    req.ip if req.path.start_with?("/users/sign_in") && req.post?
  end

  throttle("logins/email", limit: 5, period: 1.minute) do |req|
    if req.path.start_with?("/users/sign_in") && req.post?
      req.params.dig("user", "email").to_s.downcase.strip.presence
    end
  end

  # Sign up, password reset and confirmation emails
  throttle("auth_emails/ip", limit: 5, period: 1.minute) do |req|
    req.ip if req.post? && (req.path.start_with?("/users/password") || req.path.start_with?("/users/confirmation") || req.path == "/users" || req.path == "/users.json")
  end

  throttle("password_update/ip", limit: 10, period: 1.minute) do |req|
    req.ip if req.path.start_with?("/update_password/") && req.patch?
  end

  # Chat, comments, reactions and friend requests
  throttle("writes/ip", limit: 120, period: 1.minute) do |req|
    req.ip if (req.post? || req.patch?) && !req.path.start_with?("/users/")
  end

  self.throttled_responder = lambda do |_req|
    [429, { "Content-Type" => "application/json" }, [{ success: false, error: "Too many requests. Please try again later." }.to_json]]
  end
end
