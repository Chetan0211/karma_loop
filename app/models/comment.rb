# == Schema Information
#
# Table name: comments
#
#  id           :uuid             not null, primary key
#  created_at   :datetime         not null
#  updated_at   :datetime         not null
#  commenter_id :uuid             not null
#  parent_id    :uuid
#  post_id      :uuid             not null
#
# Foreign Keys
#
#  fk_rails_...  (commenter_id => users.id)
#  fk_rails_...  (parent_id => comments.id) ON DELETE => cascade
#  fk_rails_...  (post_id => posts.id)
#
class Comment < ApplicationRecord
  has_rich_text :comment
  belongs_to :post
  belongs_to :commenter, class_name: 'User'
  belongs_to :parent, class_name: 'Comment', optional: true
  has_many :replies, class_name: 'Comment', foreign_key: 'parent_id', dependent: :destroy

  has_many :comments_reactions, dependent: :destroy

  scope :with_comment, -> {
    joins("INNER JOIN action_text_rich_texts ON action_text_rich_texts.record_type = 'Comment' AND action_text_rich_texts.record_id = comments.id AND action_text_rich_texts.name = 'comment'").select("*")
  }
end
