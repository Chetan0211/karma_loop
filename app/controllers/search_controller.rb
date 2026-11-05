class SearchController < ApplicationController
  before_action :authenticate_user!

  def autocomplete
    @grouped_results = nil
    @search_text = params["search_text"]
    @user = current_user
    if params["search_text"].present?
      users = User.search(params["search_text"], where: { user_deleted: false }, match: :word_start, limit: 10).to_a
      posts = Post.search(params["search_text"], where: { post_status: "published", post_deleted: false }, match: :word_start, limit: 10)
        .select { |post| can?(:read, post) }
      @grouped_results = { "User" => users, "Post" => posts }
    end
    respond_to do |format|
      format.turbo_stream
    end
  end

  def index
    
  end

  def search_user_community
  end
end
