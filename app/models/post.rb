# == Schema Information
#
# Table name: posts
#
#  id                  :uuid             not null, primary key
#  deleted_at          :datetime
#  dislikes            :integer          default(0), not null
#  likes               :integer          default(0), not null
#  title               :string           not null
#  created_at          :datetime         not null
#  updated_at          :datetime         not null
#  content_category_id :uuid             not null
#  user_id             :uuid             not null
#
# Indexes
#
#  index_posts_on_content_category_id  (content_category_id)
#  index_posts_on_user_id              (user_id)
#
# Foreign Keys
#
#  fk_rails_...  (content_category_id => content_categories.id)
#  fk_rails_...  (user_id => users.id)
#
class Post < ApplicationRecord
  has_rich_text :description
  belongs_to :user
  belongs_to :content_category, inverse_of: :posts
  has_many :comments, dependent: :destroy
  has_many :posts_reactions, dependent: :destroy

  scope :with_description, ->{
    joins("INNER JOIN action_text_rich_texts on action_text_rich_texts.record_type = 'Post' AND action_text_rich_texts.record_id = posts.id AND action_text_rich_texts.name = 'description'").select("*")
  }

  def current_user_reaction(user_id)
    posts_reactions.where(user_id: user_id).first.reaction
  end

  

end
