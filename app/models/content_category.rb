# == Schema Information
#
# Table name: content_categories
#
#  id         :uuid             not null, primary key
#  category   :string           not null
#  created_at :datetime         not null
#  updated_at :datetime         not null
#
# Indexes
#
#  index_content_categories_on_category  (category) UNIQUE
#
class ContentCategory < ApplicationRecord
  searchkick
  has_many :posts

  def search_data
    {
      category: category,
      post_id: posts.pluck(:id)
    }
  end
end
