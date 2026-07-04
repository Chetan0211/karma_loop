# frozen_string_literal: true

class Users::PasswordsController < Devise::PasswordsController
  skip_before_action :require_no_authentication, only: [:edit]
  # GET /resource/password/new
  # def new
  #   super
  # end

  # POST /resource/password
  # def create
  #   super
  # end

  # GET /resource/password/edit?reset_password_token=abcdef
  def edit
    super
    @user = User.with_reset_password_token(params[:reset_password_token])
  end

  # PUT /resource/password
  def update
    user_params = reset_password_params
    result = User::UpdatePassword.call(params: user_params, skip_rescue_key: params[:skip_secure_key] == 'true')
    if result.success?
      url = params[:skip_secure_key] == 'true' ? secure_key_path : user_session_path
      respond_to do |format|
        format.json { render json: { success: true, redirect_url: url } }
      end
    else
      flash[:error] = result['contract.default'] == nil ? "Internal Server Error" : result['contract.default'].errors&.full_messages&.join(", ")
      respond_to do |format|
        format.json { render json: { success: false, errors: flash.now[:error], redirect_url: edit_user_password_url }, status: :unprocessable_entity }
      end
    end
  end

  # protected

  # def after_resetting_password_path_for(resource)
  #   super(resource)
  # end
  def reset_password_params
    params.require(:user).permit(:password, :password_confirmation, :reset_password_token, :public_key, :encrypted_key)
  end

  # The path used after sending reset password instructions
  # def after_sending_reset_password_instructions_path_for(resource_name)
  #   super(resource_name)
  # end
end
