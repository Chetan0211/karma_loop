# == Schema Information
#
# Table name: groups
#
#  id          :uuid             not null, primary key
#  description :string
#  name        :string
#  type        :string
#  created_at  :datetime         not null
#  updated_at  :datetime         not null
#  admin_id    :uuid
#
# Indexes
#
#  index_groups_on_admin_id  (admin_id)
#  index_groups_on_type      (type)
#
# Foreign Keys
#
#  fk_rails_...  (admin_id => users.id)
#
FactoryBot.define do
  factory :group do
    trait :group_friend do
      type{ "friend" }
    end
    trait :group_group do
      type{ "group" }
    end
    trait :group_community do
      type{ "community" }
      name{ Faker::Name.name }
      description{ Faker::Lorem.characters(number: 180) }
      association :admin, factory: :user
    end
  end
end
