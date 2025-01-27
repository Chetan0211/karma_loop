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
FactoryBot.define do
  factory :post do
    title{"Post title"}
    association :user, factory: :user
    association :content_category, factory: :content_category
    after(:build) do |post|
      post.description = "<p>This is a temp description</p>"
    end
  end
end
