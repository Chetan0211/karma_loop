# == Schema Information
#
# Table name: posts_reactions
#
#  id         :uuid             not null, primary key
#  reaction   :string           not null
#  created_at :datetime         not null
#  updated_at :datetime         not null
#  post_id    :uuid             not null
#  user_id    :uuid             not null
#
# Indexes
#
#  index_posts_reactions_on_post_id  (post_id)
#  index_posts_reactions_on_user_id  (user_id)
#
# Foreign Keys
#
#  fk_rails_...  (post_id => posts.id) ON DELETE => cascade
#  fk_rails_...  (user_id => users.id)
#
require 'rails_helper'

RSpec.describe PostsReaction, type: :model do
  describe "PostsReaction table" do
    it{ should have_db_column(:post_id).of_type(:uuid).with_options(null: false) }
    it{ should have_db_column(:user_id).of_type(:uuid).with_options(null: false) }
    it{ should have_db_column(:reaction).of_type(:string).with_options(null: false) }
  end

  it "is valid with valid data" do
    post_reaction = build(:posts_reaction)

    expect(post_reaction).to be_valid
  end

  it "is not valid without a post" do
    post_reaction = build(:posts_reaction, post: nil)

    expect(post_reaction).to  be_invalid
  end

  it "is not valid without a user" do
    post_reaction = build(:posts_reaction, user: nil)

    expect(post_reaction).to  be_invalid
  end

  it "is not valid with an invalid reaction" do
    post_reaction = build(:posts_reaction, reaction: 'heart')

    expect(post_reaction).to be_invalid
  end
end
