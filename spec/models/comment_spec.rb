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
require 'rails_helper'

RSpec.describe Comment, type: :model do
  describe "Comment table" do
    it{ should have_rich_text(:comment)}
    it{ should have_db_column(:commenter_id).of_type(:uuid).with_options(null: false)}
    it{ should have_db_column(:parent_id).of_type(:uuid).with_options(null: true)}
    it{ should have_db_column(:post_id).of_type(:uuid).with_options(null: false)}
  end

  it "is valid with valid values" do
    comment = build(:comment)
    expect(comment).to be_valid
  end

  it "is valid with correct comment" do
    comment = create(:comment)
    comment.comment = "<p>Testing comment</p>"
    comment.save!

    expect(comment.comment.body.to_html).to eq("<p>Testing comment</p>")
  end

  it "is valid to fetch with_comment" do
    create(:comment)
    fetch_comment = Comment.with_comment().first

    expect(fetch_comment.body).to eq("<p>Test comment</p>")
  end
end
