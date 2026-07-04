class NotificationService
  attr_reader :record, :params, :notification_type
  def initialize(record, params = {})
    @record = record
    @params = params
    @notification_type = self.class.name
  end

  def self.with(**event_data)
    new(event_data[:record], event_data.except(:record))
  end

  def deliver(recipients)
    recipients_array = Array(recipients)

    begin
      NotificationEvent.transaction do
        event = NotificationEvent.create!(record: record, type: notification_type, params: params)

        recipients_array.each do |recipient|
          event.notifications.create!(
            recipient: recipient
          )
        end
        event.update!(notifications_count: event.notifications.count)
        send_notifications(event)
      end
    rescue ActiveRecord::RecordInvalid => e
      Rails.logger.error "Failed to create notification record(s) immediately: #{e.message}"
      # Handle error, e.g., logging, error reporting
    end
  end

  def deliver_later(recipients)
    recipients_array = Array(recipients)
    NotificationJob.perform_later(class_name: self.class.name,record: record, notification_type: notification_type, params: params, recipients: recipients_array.pluck(:id), recipient_class: recipients_array.first.class.name)
  end

  def via_action_cable(notification)
    # Will be implemented in child classes
  end
  def via_turbo_stream(notification)
    # Will be implemented in child classes
  end
  def via_email(notification)
    # Will be implemented in child classes
  end

  private

  def send_notifications(event)
    event.notifications.each do |notification|
      via_action_cable(notification)
      via_turbo_stream(notification)
      via_email(notification)
    end
  end
end
