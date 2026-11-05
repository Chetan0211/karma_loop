class GiphyController < ApplicationController
  before_action :authenticate_user!

  # GET /giphy/search?kind=gifs|stickers&q=...&offset=...
  # Without a query it returns what's trending
  def search
    render json: GiphyService.search(kind: params[:kind], query: params[:q], offset: params[:offset])
  rescue GiphyService::Error => e
    Rails.logger.error "Giphy search failed: #{e.message}"
    render json: { error: "GIF search is unavailable right now." }, status: :bad_gateway
  end
end
