# == Schema Information
#
# Table name: comments_reactions
#
#  id         :uuid             not null, primary key
#  reaction   :string           not null
#  created_at :datetime         not null
#  updated_at :datetime         not null
#  comment_id :uuid             not null
#  post_id    :uuid
#  user_id    :uuid             not null
#
# Indexes
#
#  index_comments_reactions_on_comment_id  (comment_id)
#  index_comments_reactions_on_post_id     (post_id)
#  index_comments_reactions_on_user_id     (user_id)
#
# Foreign Keys
#
#  fk_rails_...  (comment_id => comments.id) ON DELETE => cascade
#  fk_rails_...  (post_id => posts.id)
#  fk_rails_...  (user_id => users.id)
#
class CommentsReaction < ApplicationRecord
  REACTION_TYPES = %w[like dislike].freeze
  validates :reaction, inclusion: { in: REACTION_TYPES }

  belongs_to :comment
  belongs_to :user
end
