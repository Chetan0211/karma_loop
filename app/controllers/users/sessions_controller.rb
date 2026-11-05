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
      format.json do
        resource = warden.authenticate(auth_options)
        if resource
          sign_in(resource_name, resource)
          render json: { success: true, 
          redirect_url: root_path, 
          user_key: resource.encrypted_key}, status: :ok
        else
          render json: { success: false, error: "Invalid email or password" }, status: :unprocessable_entity
        end
      end
    end
  end

  # DELETE /resource/sign_out
  def destroy
    signed_out_user = current_user
    super
    cookies.delete(:kloop_session_user_id) # cleanup for sessions created before cable auth moved to warden
    ActionCable.server.remote_connections.where(current_user: signed_out_user).disconnect if signed_out_user
  end

  # protected

  # If you have extra params to permit, append them to the sanitizer.
  # def configure_sign_in_params
  #   devise_parameter_sanitizer.permit(:sign_in, keys: [:attribute])
  # end
end
