class Notification::ChatNotification < NotificationService

  def via_action_cable(notification)
    ActionCable.server.broadcast "notification_channel_#{notification.recipient.id}", {title: self.class.message(notification), body: notification.notification_event.params["chat"]["message"]}
  end

  

  def self.message(notification)
    "#{notification.notification_event.record.username} sent you a message."
  end
end