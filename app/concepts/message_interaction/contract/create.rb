class MessageInteraction::Contract::Create < ApplicationContract
  property :user_id
  property :chat_id
  property :reaction
  property :read_at

  validates :user_id, presence: true
  validates :chat_id, presence: true
  validate :reaction_is_one_emoji

  # A reaction is any single emoji (one grapheme, so flags, skin tones and ZWJ sequences count as one)
  def reaction_is_one_emoji
    return if reaction.blank?
    one_grapheme = reaction.length <= 16 && reaction.scan(/\X/).one?
    emoji = reaction.match?(/\p{Extended_Pictographic}|\p{Regional_Indicator}|⃣/)
    errors.add(:reaction, "must be a single emoji") unless one_grapheme && emoji
  end
end