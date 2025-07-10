class ApplicationController < ActionController::Base
  before_action :set_current
  around_action :set_time_zone

  rescue_from CanCan::AccessDenied do |exception|
    flash[:error] = "Access Denied: #{exception.message}"
    redirect_to root_path
  end

  private
  def set_current
    Current.user = current_user
    Current.ability = Ability.new(current_user) if current_user
  end


  def set_time_zone
    time_zone = cookies[:time_zone]
    if time_zone.present? && ActiveSupport::TimeZone[time_zone].present?
      Time.use_zone(time_zone) { yield }
    else
      yield
    end
  end
end
