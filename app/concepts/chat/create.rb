class Chat::Create < Trailblazer::Operation
  step :setup_model
  step Contract::Build(constant: Chat::Contract::Create)
  step Contract::Validate()
  step Contract::Persist()
  step :send_notification
  step :update_ui

  def setup_model(result, chat_params:, temp_chat_id:, **)
    result[:model] = Chat.new(chat_params)
    result[:temp_chat_id] = temp_chat_id
  end

  def send_notification(result, **)
    true
  end

  def update_ui(result, **)
    # Loop through group members and update the UI 
    users = User.includes(:group_users).where(group_users:{group_id: result[:model].group_id})
    chat = Chat.find(result[:model].id)
    users.each do |user|
      Turbo::StreamsChannel.broadcast_render_to("ui_#{user.id}", 
        template: "chat/create", 
        locals:{
          chat: chat, 
          current_user: user,
          group_id: result[:model].group_id,
          temp_chat_id: result[:temp_chat_id]
        },
      )
    end
    true
  end

end