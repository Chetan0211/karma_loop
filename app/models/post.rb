# == Schema Information
#
# Table name: posts
#
#  id                  :uuid             not null, primary key
#  content_type        :text             default("post"), not null
#  deleted_at          :datetime
#  processed_video_url :string
#  scope               :text             default("public"), not null
#  status              :text             not null
#  title               :string           not null
#  created_at          :datetime         not null
#  updated_at          :datetime         not null
#  content_category_id :uuid             not null
#  user_id             :uuid             not null
#
# Indexes
#
#  index_posts_on_content_category_id  (content_category_id)
#  index_posts_on_content_type         (content_type)
#  index_posts_on_scope                (scope)
#  index_posts_on_status               (status)
#  index_posts_on_user_id              (user_id)
#
# Foreign Keys
#
#  fk_rails_...  (content_category_id => content_categories.id)
#  fk_rails_...  (user_id => users.id)
#
class Post < ApplicationRecord
  CONTENT_TYPE = %w[blog images video].freeze
  STATUS = %w[published video_process failed drafted archived deleted].freeze
  SCOPE = %w[public private].freeze

  has_rich_text :description
  has_many_attached :images
  has_one_attached :video
  belongs_to :user
  belongs_to :content_category, inverse_of: :posts
  has_many :comments, dependent: :destroy
  has_many :posts_reactions, dependent: :destroy

  validates :content_type, inclusion: { in: CONTENT_TYPE }
  validates :status, inclusion: { in: STATUS }
  validates :scope, inclusion: { in: SCOPE }

  scope :with_description, ->{
    joins("INNER JOIN action_text_rich_texts on action_text_rich_texts.record_type = 'Post' AND action_text_rich_texts.record_id = posts.id AND action_text_rich_texts.name = 'description'").select("*")
  }

  def current_user_reaction(user_id)
    posts_reactions.where(user_id: user_id).first&.reaction
  end

  def likes
    PostsReaction.where(post_id: id, reaction: 'like').count
  end

  def dislikes
    PostsReaction.where(post_id: id, reaction: 'dislike').count
  end
end
