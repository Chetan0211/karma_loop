class UserController < ApplicationController
  before_action :authenticate_user!, except: [:secure_key, :save_keys]

  def secure_key
  end

  def save_keys
    result = User::SaveKeys.call({user_id: params[:user_id], public_key: params[:public_key], encrypted_key: params[:encrypted_key]})

    if result.success?
      render json: { success: true, message: "Keys saved successfully" }, status: :no_content
    else
      flash[:error] = "Failed to save keys"
      render json: { success: false, errors: result['contract.default'].errors.full_messages }, status: :unprocessable_entity
    end
  end

  def profile
    @user = User.includes(:posts, :comments).find(params[:id])
  end

  def connections
  end

  def update_profile_picture
    picture = profile_picture_params
    UpdateProfilePicJob.perform_now(params[:id], picture["profile_picture"], picture["crop_x"], picture["crop_y"], picture["crop_size"])
    head :no_content
  end

  def update_profile
    status = User::Update.call({params: profile_picture_params, user_id: params[:id]})
    if status.success?
      redirect_to user_profile_path(id: params[:id])
    else
      #flash[:errors] = status['contract.default'].errors
    end
  end

  def remove_profile_picture
    UpdateProfilePicJob.perform_now(params[:id], nil, 0, 0, 0)
    head :no_content
  end

  def update_password
    if(current_user.id == params[:id])
      if current_user.update_with_password(password: params[:new_password], password_confirmation: params[:confirm_new_password], current_password: params[:current_password])
        bypass_sign_in(current_user)
        render json: { message: "Password updated successfully" }, status: :no_content
        return
      else
        render json: current_user.errors, status: :unprocessable_entity
        return
      end
    else
      render json: { error: "Unauthorized" }, status: :unauthorized
      return
    end
  end

  private

  def profile_picture_params
    params.require(:edit_profile).permit(:profile_picture, :prev_profile_picture, :display_name, :bio, :crop_x, :crop_y, :crop_size)
  end
end
