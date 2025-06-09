class SearchController < ApplicationController
  def autocomplete
    if params["search_text"].present?
      search_results = Searchkick.search(params["search_text"], models:[User, Post], match: :word_start, limit: 10)
      grouped_results = search_results.group_by{|result| result.class.to_s}
      render partial: "layouts/autosearch",  locals: {users: grouped_results["User"].present? ? grouped_results["User"] : [], posts: grouped_results["Post"].present? ? grouped_results["Post"] : []}
    else
      render partial: "shared/trending_posts",  locals: {posts: []}
    end
  end

  def index
    
  end

  def search_user_community
  end
end
