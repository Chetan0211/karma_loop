class Chat::Contract::Create < ApplicationContract
  property :message
  property :group_id
  property :user_id
  property :reply_to_id

  validates :group_id, :user_id, presence: true
end