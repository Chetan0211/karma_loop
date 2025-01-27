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
FactoryBot.define do
  factory :content_category do
    category{"test_content"}
  end
end
