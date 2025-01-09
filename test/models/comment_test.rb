# == Schema Information
#
# Table name: comments
#
#  id           :uuid             not null, primary key
#  dislikes     :integer          default(0), not null
#  likes        :integer          default(0), not null
#  created_at   :datetime         not null
#  updated_at   :datetime         not null
#  commenter_id :uuid             not null
#  parent_id    :uuid
#  post_id      :uuid             not null
#
# Foreign Keys
#
#  fk_rails_...  (commenter_id => users.id)
#  fk_rails_...  (parent_id => comments.id) ON DELETE => cascade
#  fk_rails_...  (post_id => posts.id)
#
require "test_helper"

class CommentTest < ActiveSupport::TestCase
  # test "the truth" do
  #   assert true
  # end
end
