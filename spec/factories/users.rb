# == Schema Information
#
# Table name: users
#
#  id                     :uuid             not null, primary key
#  bio                    :string(200)
#  confirmation_sent_at   :datetime
#  confirmation_token     :string
#  confirmed_at           :datetime
#  deleted_at             :datetime
#  display_name           :string(30)       not null
#  dob                    :datetime         not null
#  email                  :string           default(""), not null
#  encrypted_password     :string           default(""), not null
#  is_admin               :boolean          default(FALSE), not null
#  remember_created_at    :datetime
#  reset_password_sent_at :datetime
#  reset_password_token   :string
#  unconfirmed_email      :string
#  username               :string           not null
#  created_at             :datetime         not null
#  updated_at             :datetime         not null
#
# Indexes
#
#  index_users_on_confirmation_token    (confirmation_token) UNIQUE
#  index_users_on_display_name          (display_name)
#  index_users_on_email                 (email) UNIQUE
#  index_users_on_reset_password_token  (reset_password_token) UNIQUE
#  index_users_on_username              (username) UNIQUE
#
require 'faker'
FactoryBot.define do
  factory :user do
    username{ Faker::Internet.unique.username }
    email{ Faker::Internet.unique.email }
    password{"Chtingiagem@0132!32"}
    dob{"02/11/2000"}
    is_admin{false}
    confirmed_at{Time.now}
    display_name{Faker::Name.name}
    bio{Faker::Lorem.characters(number: 180)}
    deleted_at{nil}

    trait :admin do
      is_admin{true}
    end
  end

  factory :create_user_params, class: Hash do 
    username{ Faker::Internet.unique.username }
    email{ Faker::Internet.unique.email }
    password{"Chtingiagem@0132!32"}
    password_confirmation{"Chtingiagem@0132!32"}
    dob{"2000-02-10"}
    display_name{Faker::Name.name}

    # This tells FactoryBot to create the hash using all defined attributes
    initialize_with { attributes }

    trait :invalid_username do
      username{"username!@$"}
    end

    trait :invalid_email do
      email{"email!@$"}
    end

    trait :invalid_password do
      password{"123456"}
    end
  end
end
