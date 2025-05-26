CLOUDFLARE_R2_CONFIG = {
  access_key_id: ENV['CLOUDFLARE_R2_ACCESS_KEY_ID'],
  secret_access_key: ENV['CLOUDFLARE_R2_SECRET_ACCESS_KEY'],
  endpoint: ENV['CLOUDFLARE_R2_ENDPOINT'],
  bucket_name: ENV['CLOUDFLARE_R2_BUCKET_NAME'],
  pub_endpoint: ENV['CLOUDFLARE_R2_BUCKET_PUB_ENDPOINT'],
  region: "auto"
}

S3_CLIENT_R2 = Aws::S3::Client.new(
endpoint: CLOUDFLARE_R2_CONFIG[:endpoint],
access_key_id: CLOUDFLARE_R2_CONFIG[:access_key_id],
secret_access_key: CLOUDFLARE_R2_CONFIG[:secret_access_key],
region: CLOUDFLARE_R2_CONFIG[:region]
)
if Rails.env.development?
  Rails.logger ||= Logger.new(STDOUT)
  Aws.config.update(
    logger: Rails.logger,
    log_level: :debug,
    http_wire_trace: true
  )
end