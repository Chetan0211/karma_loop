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
require "test_helper"

class ContentCategoryTest < ActiveSupport::TestCase
  # test "the truth" do
  #   assert true
  # end
end
