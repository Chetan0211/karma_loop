REDIS_POOL = ConnectionPool.new(size: 5, timeout: 5) do
  Redis.new(url: "redis://localhost:6379/0")
end