class FriendsController < ApplicationController
  include SendPopupMessage

  before_action :authenticate_user!

  def friend_request
    result = Friend::Request.call(params: {from: current_user.id, to: params[:id]})
    if result.success?
      head :ok
    else
      head :internal_server_error
      send_error_popup(user_id: current_user.id, message: "Something went wrong. Can't able to send friend request.")
    end
  end

  def request_response
    result = Friend::RespondRequest.call(params:{from: current_user.id, to: params[:id], status: params[:status]})
    if result.success?
      head :ok
    else
      head :internal_server_error
      send_error_popup(user_id: current_user.id, message: "Something went wrong. Can't able to respond to friend request.")
    end
  end

  def unfollow_friend
    result = Friend::Unfollow.call(params: {from: current_user.id, to: params[:id]})
    if result.success?
      head :ok
    else
      head :internal_server_error
      send_error_popup(user_id: current_user.id, message: "Something went wrong. Can't able to unfollow a friend.")
    end
  end

  def remove_friend
    result = Friend::Remove.call(params:{from: current_user.id, to: params[:id]})
    if result.success?
      head :ok
    else
      head :internal_server_error
      send_error_popup(user_id: current_user.id, message: "Something went wrong. Can't able remove a friend.")
    end
  end
end
