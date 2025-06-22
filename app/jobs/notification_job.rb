class NotificationJob < ApplicationJob
  queue_as :default

  def perform(**args)
    service = args[:class_name].constantize
    service.with(record: args[:record], notification_type: args[:notification_type], **args[:params]).deliver(args[:recipients])
  end
end
