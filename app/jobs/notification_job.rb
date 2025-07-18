class NotificationJob < ApplicationJob
  queue_as :notification

  def perform(**args)
    service = args[:class_name].constantize
    recipients = args[:recipient_class].constantize.where(id: args[:recipients])
    service.with(record: args[:record], notification_type: args[:notification_type], **args[:params]).deliver(recipients)
  end
end
