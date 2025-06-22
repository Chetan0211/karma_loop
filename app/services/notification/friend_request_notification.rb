  class Notification::FriendRequestNotification < NotificationService
    def via_action_cable(notification)
      ActionCable.server.broadcast "notification_channel_#{notification.recipient.id}", {title: self.class.message(notification)}
    end

    def via_turbo_stream(notification)
      Turbo::StreamsChannel.broadcast_prepend_to("ui_#{notification.recipient.id}", partial: "shared/notification", target: "notifications_list" , locals: { notification: notification })
      Turbo::StreamsChannel.broadcast_replace_to("ui_#{notification.notification_event.record.id}", partial: "shared/helpers/follow_request_button", target: "#{notification.notification_event.record.id}_follow_button_#{notification.recipient.id}", locals: {current_user: notification.notification_event.record, user: notification.recipient })
    end

    def self.message(notification)
      if notification.notification_event.params["group_user"]["status"] == "follower"
        "#{notification.notification_event.record.username} started following you."
      else
        "#{notification.notification_event.record.username} sent you a friend request"
      end
    end
    def self.link(notification)
      Rails.application.routes.url_helpers.user_profile_path(notification.notification_event.record)
    end
  end