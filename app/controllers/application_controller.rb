class ApplicationController < ActionController::Base
  before_action :set_current

  rescue_from CanCan::AccessDenied do |exception|
    flash[:error] = "Access Denied: #{exception.message}"
    redirect_to root_path
  end

  private
  def set_current
    Current.user = current_user
    Current.ability = Ability.new(current_user) if current_user
  end
end
