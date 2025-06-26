class FriendsController < ApplicationController
  before_action :authenticate_user!

  def friend_request
    result = Friend::Request.call(params: {from: current_user.id, to: params[:id]})
    if result.success?
      head :ok
    else
      head :bad_request
      Turbo::StreamsChannel.broadcast_update_to(
        "#{current_user.id}error_notifications",
        target: "error-notifications",
        partial: "shared/error_message",
        locals: { message: "Something went wrong. Can't able to send friend request" }
      )
    end
  end

  def request_response
    result = Friend::RespondRequest.call(params:{from: current_user.id, to: params[:id], status: params[:status]})
    if result.success?
      head :ok
    else
      head :bad_request
      Turbo::StreamsChannel.broadcast_update_to(
        "#{current_user.id}error_notifications",
        target: "error-notifications",
        partial: "shared/error_message",
        locals: { message: "Something went wrong. Can't able to respond to friend request" }
      )
    end
  end

  def unfollow_friend
    result = Friend::Unfollow.call(params: {from: current_user.id, to: params[:id]})
    if result.success?
      puts "Status OK sending status"
      head :ok
    else
      puts "Status bad request sending status"
      head :bad_request
      Turbo::StreamsChannel.broadcast_update_to(
        "#{current_user.id}error_notifications",
        target: "error-notifications",
        partial: "shared/error_message",
        locals: { message: "Something went wrong. Can't able to unfollow a friend." }
      )
    end
  end
end
