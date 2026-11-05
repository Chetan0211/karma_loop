class Chat::Contract::Create < ApplicationContract
  property :message
  property :attachments_manifest
  property :group_id
  property :user_id
  property :reply_to_id

  validates :group_id, :user_id, presence: true
  validate :reply_to_in_same_group

  private

  def reply_to_in_same_group
    return if reply_to_id.blank?
    errors.add(:reply_to_id, "is invalid") unless Chat.exists?(id: reply_to_id, group_id: group_id)
  end
end