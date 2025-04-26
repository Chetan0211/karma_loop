# == Schema Information
#
# Table name: posts
#
#  id                  :uuid             not null, primary key
#  content_type        :text             default("post"), not null
#  deleted_at          :datetime
#  dislikes            :integer          default(0), not null
#  likes               :integer          default(0), not null
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
#  index_posts_on_user_id              (user_id)
#
# Foreign Keys
#
#  fk_rails_...  (content_category_id => content_categories.id)
#  fk_rails_...  (user_id => users.id)
#
require "test_helper"

class PostTest < ActiveSupport::TestCase
  # test "the truth" do
  #   assert true
  # end
end
