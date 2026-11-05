# Searches Giphy from the server, so the API key stays private and users' search terms
# don't go from their browser to Giphy. The GIF files themselves still load from Giphy's CDN.
class GiphyService
  class Error < StandardError; end

  BASE_URL = "https://api.giphy.com/v1".freeze
  KINDS = %w(gifs stickers).freeze
  PAGE_SIZE = 24
  # Giphy rejects offsets above this
  MAX_OFFSET = 4999

  def self.search(kind:, query:, offset: 0)
    new(kind: kind, query: query, offset: offset).search
  end

  def initialize(kind:, query:, offset:)
    @kind = KINDS.include?(kind) ? kind : "gifs"
    @query = query.to_s.strip.first(50)
    @offset = offset.to_i.clamp(0, MAX_OFFSET)
  end

  def search
    # Cache results, the free Giphy key only allows a limited number of calls per hour
    Rails.cache.fetch(["giphy", @kind, @query.downcase, @offset], expires_in: 10.minutes) do
      response = fetch
      {
        results: response.fetch("data", []).filter_map { |item| serialize(item) },
        next_offset: next_offset(response["pagination"])
      }
    end
  end

  private

  def fetch
    api_key = ENV["GIPHY_API_KEY"]
    raise Error, "GIPHY_API_KEY is not set" if api_key.blank?

    params = { api_key: api_key, limit: PAGE_SIZE, offset: @offset, rating: "pg-13" }
    endpoint = if @query.present?
      params[:q] = @query
      "search"
    else
      "trending"
    end

    uri = URI("#{BASE_URL}/#{@kind}/#{endpoint}")
    uri.query = URI.encode_www_form(params)
    response = Net::HTTP.start(uri.host, uri.port, use_ssl: true, open_timeout: 3, read_timeout: 5) do |http|
      http.get(uri.request_uri)
    end
    raise Error, "Giphy responded with #{response.code}" unless response.is_a?(Net::HTTPSuccess)

    JSON.parse(response.body)
  rescue JSON::ParserError, Net::OpenTimeout, Net::ReadTimeout, SocketError, SystemCallError, OpenSSL::SSL::SSLError => e
    raise Error, e.message
  end

  # Only pass on what the picker needs: a small preview to show in the grid
  # and a 200px wide rendition to send in the chat
  def serialize(item)
    images = item["images"] || {}
    preview = images["fixed_width_small"] || images["fixed_width"]
    full = images["fixed_width"]
    return nil if preview.blank? || full.blank?

    {
      id: item["id"],
      title: item["title"].to_s,
      preview_url: preview["url"],
      url: full["url"],
      width: full["width"].to_i,
      height: full["height"].to_i
    }
  end

  def next_offset(pagination)
    return nil if pagination.blank?

    next_offset = pagination["offset"].to_i + pagination["count"].to_i
    next_offset < pagination["total_count"].to_i && next_offset <= MAX_OFFSET ? next_offset : nil
  end
end
