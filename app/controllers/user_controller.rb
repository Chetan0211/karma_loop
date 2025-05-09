class UserController < ApplicationController
  before_action :authenticate_user!

  def profile
    @user = User.includes(:comments).find(params[:id])
    @posts = Post.where(user: @user)
  end

  def update_profile_picture
    picture = profile_picture_params
    UpdateProfilePicJob.perform_now(params[:id], picture["profile_picture"], picture["crop_x"], picture["crop_y"], picture["crop_size"])
    head :no_content
  end

  def update_profile
    picture = profile_picture_params
    if picture["profile_picture"] != nil
      UpdateProfilePicJob.perform_now(params[:id], picture["profile_picture"], picture["crop_x"], picture["crop_y"], picture["crop_size"])
    else
      UpdateProfilePicJob.perform_now(params[:id], nil, 0, 0, 0)
    end
    redirect_to user_profile_path(id: params[:id])
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
    params.require(:edit_profile).permit(:profile_picture, :crop_x, :crop_y, :crop_size)
  end
end
