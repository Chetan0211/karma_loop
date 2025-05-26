class HomeController < ApplicationController
  before_action :authenticate_user!
  def index
    @user = current_user
    @posts = Post.includes(:user).where(status: "published").order(created_at: :desc)
  end
end
