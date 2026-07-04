Rails.application.config.session_store :redis_session_store,
  key: '_karma_loop_session',
  redis: {
    url: ENV.fetch("REDIS_URL") { "redis://localhost:6379/1" },
    key_prefix: 'karma_loop:session:'
  }