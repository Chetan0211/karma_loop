# TODO: In future need to develop admin panel
class AdminController < ApplicationController
  before_action :authenticate_user!, :require_admin!

  def index
  end
end
