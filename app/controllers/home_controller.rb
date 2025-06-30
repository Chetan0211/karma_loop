class HomeController < ApplicationController
  before_action :authenticate_user!
  def index
    @user = current_user
    @posts = Post.accessible_by(current_ability, :read, strategy: :subquery).order(created_at: :desc)
  end
end
