class Chat::Create < Trailblazer::Operation
  step :setup_model
  step Contract::Build(constant: Chat::Contract::Create)
  step Contract::Validate()
  step :validate_attachments_and_message
  step Contract::Persist()
  step :add_message_interaction
  step :send_notification
  step :update_ui

  def setup_model(result, chat_params:, temp_chat_id:, **)
    result[:model] = Chat.new(chat_params)
    result[:temp_chat_id] = temp_chat_id
  end

  def validate_attachments_and_message(result, **)
    if result[:model].message.blank? && result[:model].attachments.blank?
      result['contract.default'].errors.add(:message, "Message and attachments can't be blank.")
      return false
    else
      true
    end
  end

  def add_message_interaction(result, **)
    params ={
      user_id: result[:model].user_id,
      chat_id: result[:model].id,
      read_at: DateTime.now.utc
    }
    MessageInteraction::Create.call(params: params)
    true
  end

  def send_notification(result, **)
    result[:users] = User.includes(:group_users).where(group_users:{group_id: result[:model].group_id})
    result[:chat] = Chat.find(result[:model].id)
    Notification::ChatNotification.with(record: result[:chat].user, from: result[:chat].user, group: result[:chat].group, chat: result[:chat]).deliver_later(result[:users].where.not(id: result[:model].user_id))
    true
  end

  def update_ui(result, **)
    # Loop through group members and update the UI 
    result[:users].each do |user|
      Turbo::StreamsChannel.broadcast_render_to("ui_#{user.id}", 
        template: "chat/create", 
        locals:{
          chat: result[:chat], 
          current_user: user,
          group_id: result[:chat].group_id,
          temp_chat_id: result[:temp_chat_id]
        },
      )
    end
    true
  end

end