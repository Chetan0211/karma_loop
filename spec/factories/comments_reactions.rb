FactoryBot.define do
  factory :comments_reaction do
    association :comment, factory: :comment
    association :user, factory: :user
    association :post, factory: :post
    reaction { %i[like dislike].sample }
  end
end
