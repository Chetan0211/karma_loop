# == Schema Information
#
# Table name: notification_events
#
#  id                  :uuid             not null, primary key
#  notifications_count :integer          default(0)
#  params              :jsonb
#  record_type         :string           not null
#  type                :string           not null
#  created_at          :datetime         not null
#  updated_at          :datetime         not null
#  record_id           :uuid             not null
#
# Indexes
#
#  index_notification_events_on_record_id    (record_id)
#  index_notification_events_on_record_type  (record_type)
#
class NotificationEvent < ApplicationRecord
  self.inheritance_column = :_type_disabled # because we use type as column, it is disabled
  has_many :notifications, dependent: :destroy
  belongs_to :record, polymorphic: true
end
