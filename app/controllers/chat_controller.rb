class ChatController < ApplicationController
  include SendPopupMessage
  before_action :authenticate_user!

  def index
    @pagy, @groups = pagy(current_user.all_chat_groups)
    respond_to do |format|
      format.html
      format.turbo_stream
    end
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

  def message_read
    message_interaction_params = {
      chat_id: params[:chat_id],
      user_id: current_user.id,
      read_at: DateTime.now.utc
    }

    result = MessageInteraction::Create.call(params: message_interaction_params)
    if result.success?
      group = Chat.find(params[:chat_id]).group
      users = User.includes(:group_users).where(group_users:{group_id: group.id})
      chat = Chat.find(params[:chat_id])
      message_read_stream(group, users, chat)
      head :ok
    else
      head :internal_server_error
    end
  end

  def create_message_reaction
    interaction_params = message_interaction_params
    interaction_params[:user_id] = current_user.id
    result = MessageInteraction::Create.call(params: interaction_params)
    if result.success?
      head :ok
    else
      head :internal_server_error
      send_error_popup(user_id: current_user.id, message: "Something went wrong. Can't able to react to the message.")
    end
  end

  def show
    @group = Group.find(params[:id])
    can?(:read, @group)
    @pagy, @chats = pagy(@group.chats.includes(:user, :reply_to).order(created_at: :desc))
    respond_to do |format|
      format.turbo_stream
    end
  end


  private

  def message_read_stream(group, users, chat)
    users.each do |user|
      Turbo::StreamsChannel.broadcast_action_to(
        "ui_#{user.id}",         
        action: :replace,         
        target: "chat_#{chat.id}_seen_status",            
        partial: "chat/chat_seen_status", 
        locals: {current_user: user, chat: chat}
      )
    end
  end

  def chat_params
    permitted_params = params.require(:new_chat).permit(:message, :group_id, :reply_to_id, :temporary_chat_id, attachments: [])
    permitted_params.tap do |whitelisted|
      # Use reject! to remove any blank items from the attachments array
      # The `&.` safe navigation operator prevents errors if `attachments` isn't present
      whitelisted[:attachments]&.reject!(&:blank?)
    end
  end

  def message_interaction_params
    params.require(:message_interaction).permit(:chat_id, :reaction)
  end
end
