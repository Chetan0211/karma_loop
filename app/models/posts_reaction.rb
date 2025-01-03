# == Schema Information
#
# Table name: posts_reactions
#
#  id         :uuid             not null, primary key
#  reaction   :string           not null
#  created_at :datetime         not null
#  updated_at :datetime         not null
#  post_id    :uuid             not null
#  user_id    :uuid             not null
#
# Indexes
#
#  index_posts_reactions_on_post_id  (post_id)
#  index_posts_reactions_on_user_id  (user_id)
#
# Foreign Keys
#
#  fk_rails_...  (post_id => posts.id) ON DELETE => cascade
#  fk_rails_...  (user_id => users.id)
#
class PostsReaction < ApplicationRecord
  REACTION_TYPES = %w[like dislike].freeze
  validates :reaction, inclusion: { in: REACTION_TYPES }

  belongs_to :post
  belongs_to :user
end
