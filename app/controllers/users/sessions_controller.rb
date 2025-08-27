# frozen_string_literal: true

class Users::SessionsController < Devise::SessionsController
  # before_action :configure_sign_in_params, only: [:create]

  # GET /resource/sign_in
  def new
    super
  end

  # POST /resource/sign_in
  def create
    respond_to do |format|
      format.html { super }
      format.json do
        resource = warden.authenticate(auth_options)
        if resource
          sign_in(resource_name, resource)
          cookies.encrypted[:kloop_session_user_id] = { value: current_user.id }
          render json: { success: true, 
          redirect_url: root_path, 
          user_key: resource.encrypted_key,
          encrypted_key: resource.encrypted_key }, status: :ok
        else
          flash[:error] = "Invalid email or password"
          render json: { success: false, error: "Invalid email or password", redirect_url: new_user_session_path }, status: :unprocessable_entity
        end
      end
    end
  end

  # DELETE /resource/sign_out
  def destroy
    super
    cookies.encrypted[:kloop_session] = nil if current_user == nil
  end

  # protected

  # If you have extra params to permit, append them to the sanitizer.
  # def configure_sign_in_params
  #   devise_parameter_sanitizer.permit(:sign_in, keys: [:attribute])
  # end
end
