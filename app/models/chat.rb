# == Schema Information
#
# Table name: chats
#
#  id                   :uuid             not null, primary key
#  attachments_manifest :text
#  message              :text             not null
#  created_at           :datetime         not null
#  updated_at           :datetime         not null
#  group_id             :uuid             not null
#  reply_to_id          :uuid
#  user_id              :uuid             not null
#
# Indexes
#
#  index_chats_on_group_id  (group_id)
#  index_chats_on_user_id   (user_id)
#
# Foreign Keys
#
#  fk_rails_...  (group_id => groups.id)
#  fk_rails_...  (reply_to_id => chats.id)
#  fk_rails_...  (user_id => users.id)
#
class Chat < ApplicationRecord
  has_many_attached :attachments, dependent: :destroy

  belongs_to :group
  belongs_to :user
  has_many :message_interactions, dependent: :destroy
  belongs_to :reply_to, class_name: 'Chat', foreign_key: :reply_to_id, optional: true
  has_many :replies, class_name: 'Chat', foreign_key: :reply_to_id, dependent: :nullify, inverse_of: :reply_to

  # Shown in a message's quick reactions; any other emoji can be picked with the "+" button
  QUICK_REACTIONS = %w[👍 ❤️ 😂 😮 😢 🙏].freeze

  def all_read?
    (group.members(user).count + 1) == message_interactions.where.not(read_at: nil).count
  end
  def user_read?(user)
    message_interactions.where(user_id: user.id).where.not(read_at: nil).present?
  end

  # { "👍" => [user, ...], ... } in the order the reactions were made
  def reactions_by_emoji
    message_interactions.includes(:user).where.not(reaction: [nil, ""]).order(:updated_at)
      .group_by(&:reaction).transform_values { |interactions| interactions.map(&:user) }
  end
end
