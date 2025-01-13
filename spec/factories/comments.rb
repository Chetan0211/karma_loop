FactoryBot.define do
  factory :comment do
    association :commenter, factory: :user
    association :post, factory: :post
    after(:build) do |comment|
      comment.comment = "<p>Test comment</p>"
    end
  end
end
