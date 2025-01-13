require 'faker'
FactoryBot.define do
  factory :user do
    username{ Faker::Name.unique.name }
    email{ Faker::Internet.unique.email }
    password{"password"}
    dob{"02/11/2000"}
    is_admin{false}
    confirmed_at{Time.now}
  end
end
