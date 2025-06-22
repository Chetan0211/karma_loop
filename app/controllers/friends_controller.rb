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

  def remove_friend_request
    
  end
end
