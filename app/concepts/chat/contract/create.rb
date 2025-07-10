class Chat::Contract::Create < ApplicationContract
  property :message
  property :group_id
  property :user_id
  property :reply_to_id
  property :attachments

  validates :message, :group_id, :user_id, presence: true
end