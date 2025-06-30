class SearchController < ApplicationController
  def autocomplete
    @search_results = nil
    @grouped_results = nil
    @search_text = params["search_text"]
    @user = current_user
    if params["search_text"].present?
      # TODO: Need to show the post results only when user has access to them.
      @search_results = Searchkick.search(params["search_text"], models:[User, Post], match: :word_start, limit: 10)
      @grouped_results = @search_results.group_by{|result| result.class.to_s}
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
