# == Schema Information
#
# Table name: comments_reactions
#
#  id         :uuid             not null, primary key
#  reaction   :string           not null
#  created_at :datetime         not null
#  updated_at :datetime         not null
#  comment_id :uuid             not null
#  post_id    :uuid             not null
#  user_id    :uuid             not null
#
# Indexes
#
#  index_comments_reactions_on_comment_id  (comment_id)
#  index_comments_reactions_on_post_id     (post_id)
#  index_comments_reactions_on_user_id     (user_id)
#
# Foreign Keys
#
#  fk_rails_...  (comment_id => comments.id) ON DELETE => cascade
#  fk_rails_...  (post_id => posts.id)
#  fk_rails_...  (user_id => users.id)
#
require 'rails_helper'

RSpec.describe CommentsReaction, type: :model do
  describe "CommentReaction table" do
    it{ should have_db_column(:comment_id).of_type(:uuid).with_options(null: false) }
    it{ should have_db_column(:post_id).of_type(:uuid).with_options(null: false) }
    it{ should have_db_column(:user_id).of_type(:uuid).with_options(null: false) }
    it{ should have_db_column(:reaction).of_type(:string).with_options(null: false) }
  end

  it "is valid with valid data" do
    comment_reaction = build(:comments_reaction)

    expect(comment_reaction).to be_valid
  end

  it "is invalid with empty user" do
    comment_reaction = build(:comments_reaction, user: nil)

    expect(comment_reaction).to be_invalid
  end

  it "is invalid with empty post" do
    comment_reaction = build(:comments_reaction, post: nil)

    expect(comment_reaction).to be_invalid
  end

  it "is invalid with empty comment" do
    comment_reaction = build(:comments_reaction, comment: nil)

    expect(comment_reaction).to be_invalid
  end

  it "is invalid with reaction other than like or dislike" do
    comment_reaction = build(:comments_reaction, reaction: "love")

    expect(comment_reaction).to be_invalid
  end
end
