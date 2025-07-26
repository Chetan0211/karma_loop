class HomeController < ApplicationController
  before_action :authenticate_user!
  def index
    @user = current_user
    @pagy, @posts = pagy(Post.accessible_by(current_ability, :read, strategy: :subquery).order(created_at: :desc))
    if params[:page]
      respond_to do |format|
        format.turbo_stream
      end
    else
      respond_to do |format|
        format.html
      end
    end
  end
end
