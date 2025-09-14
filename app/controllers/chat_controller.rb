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

  def show_active_chat_tab
    @group = Group.find(params[:id])
    can?(:read, @group)
    respond_to do |format|
      format.turbo_stream
    end
  end

  def show
    @group = Group.find(params[:id])
    can?(:read, @group)
    @pagy, @chats = pagy(@group.chats.includes(:group, :user, reply_to: :user).order(created_at: :desc))

    #Broadcasting turbo stream update
    Turbo::StreamsChannel.broadcast_update_to(
      "ui_#{current_user.id}",
      target: "fetch_chat_messages_#{@group.id}",
      partial: "chat/next_page_link",
      locals: { group: @group, pagy: @pagy }
    )

    chats_data = @chats.map do |chat|
      # Get the base JSON structure for the chat
      chat.as_json(
        include: {
          reply_to: { include: { user: { only: [:id, :username, :email] } }, methods: :attachments_data },
          group: { only: [:id, :name] },
          user: { only: [:id, :name, :email] }
        },
        methods: :attachments_data
      ).merge(
        'chat_read' => chat.user_read?(current_user),
        'all_read' => chat.all_read?
      )
    end
    respond_to do |format|
      format.json do 
        render json: {
          pagy: {
            next: @pagy.next,
            prev: @pagy.prev
          },
          current_user: {
            id: current_user.id,
            username: current_user.username,
            email: current_user.email
          },
          chats: chats_data
        }
      end
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
