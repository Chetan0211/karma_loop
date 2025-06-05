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
FactoryBot.define do
  factory :post do
    title{Faker::Book.title}
    association :user, factory: :user
    association :content_category, factory: :content_category
    after(:build) do |post|
      post.description = "<p>This is a temp description</p>"
    end

    factory :published_public_blog_post, traits: [:blog, :scope_public, :status_published]

    trait :blog do
      content_type{"blog"}
    end

    trait :image do
      content_type{"images"}
    end

    trait :video do
      content_type{"video"}
    end

    trait :scope_public do
      scope{"public"}
    end

    trait :scope_private do
      scope{"private"}
    end

    trait :status_published do
      status{"published"}
    end

    trait :status_video_process do
      status{"video_process"}
    end

    trait :status_failed do
      status{"failed"}
    end

    trait :status_drafted do
      status{"drafted"}
    end

    trait :status_archived do
      status{"archived"}
    end

    trait :status_deleted do
      status{"deleted"}
    end
  end
end
