# == Schema Information
#
# Table name: chats
#
#  id          :uuid             not null, primary key
#  message     :text             not null
#  created_at  :datetime         not null
#  updated_at  :datetime         not null
#  group_id    :uuid             not null
#  reply_to_id :uuid
#  user_id     :uuid             not null
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
  has_many_attached :attachments

  belongs_to :group
  belongs_to :user
  has_one :reply_to, class_name: 'Chat', foreign_key: :reply_to_id, optional: true
end
