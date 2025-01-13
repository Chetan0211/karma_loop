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
