class HomeController < ApplicationController
  before_action :authenticate_user!
  def index
    @user = current_user
    @pagy, @posts = pagy(Post.accessible_by(current_ability, :read, strategy: :subquery).order(created_at: :desc))
    respond_to do |format|
      format.html
      format.turbo_stream
    end
  end
end
