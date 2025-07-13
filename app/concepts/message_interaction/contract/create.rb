class MessageInteraction::Contract::Create < ApplicationContract
  property :user_id
  property :chat_id
  property :reaction
  property :read_at

  validates :user_id, presence: true
  validates :chat_id, presence: true
end