# == Schema Information
#
# Table name: notifications
#
#  id                    :uuid             not null, primary key
#  read_at               :datetime
#  recipient_type        :string           not null
#  created_at            :datetime         not null
#  updated_at            :datetime         not null
#  notification_event_id :uuid             not null
#  recipient_id          :uuid             not null
#
# Indexes
#
#  index_notifications_on_notification_event_id  (notification_event_id)
#  index_notifications_on_recipient_id           (recipient_id)
#  index_notifications_on_recipient_type         (recipient_type)
#
# Foreign Keys
#
#  fk_rails_...  (notification_event_id => notification_events.id)
#
class Notification < ApplicationRecord
  belongs_to :notification_event
  belongs_to :recipient, polymorphic: true
end
