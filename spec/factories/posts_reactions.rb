FactoryBot.define do
  factory :posts_reaction do
    association :user, factory: :user
    association :post, factory: :post
    reaction { %i[like dislike].sample }
  end
end
