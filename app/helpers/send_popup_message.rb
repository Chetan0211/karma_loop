module SendPopupMessage
  def send_error_popup(user_id:, message:)
    Turbo::StreamsChannel.broadcast_update_to(
      "#{user_id}error_notifications",
      target: "error-notifications",
      partial: "shared/error_message",
      locals: { message: message }
    )
  end
end