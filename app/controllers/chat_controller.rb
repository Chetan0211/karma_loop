class ChatController < ApplicationController
  before_action :authenticate_user!

  def index
  end

  def create
    new_chat_params = chat_params
    can?(:write, Group.find(new_chat_params[:group_id]))
    temporary_chat_id = new_chat_params[:temporary_chat_id]
    new_chat_params[:user_id] = current_user.id
    result = Chat::Create.call(temp_chat_id: temporary_chat_id, chat_params: new_chat_params.except(:temporary_chat_id))
    if result.success?
      head :ok
    else
      head :internal_server_error
      send_error_popup(user_id: current_user.id, message: "Something went wrong. Can't able to send message.")
    end
  end

  def show
    @group = Group.find(params[:id])
    can?(:read, @group)
    @chats = @group.chats.includes(:user)
    respond_to do |format|
      format.turbo_stream
    end
  end


  private

  def chat_params
    params.require(:new_chat).permit(:message, :group_id, :attachments, :reply_to_id, :temporary_chat_id)
  end
end
