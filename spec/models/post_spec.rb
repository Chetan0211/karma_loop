# == Schema Information
#
# Table name: posts
#
#  id                  :uuid             not null, primary key
#  content_type        :text             default("post"), not null
#  deleted_at          :datetime
#  processed_video_url :string
#  scope               :text             default("public"), not null
#  status              :text             not null
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
#  index_posts_on_scope                (scope)
#  index_posts_on_status               (status)
#  index_posts_on_user_id              (user_id)
#
# Foreign Keys
#
#  fk_rails_...  (content_category_id => content_categories.id)
#  fk_rails_...  (user_id => users.id)
#
require 'rails_helper'

RSpec.describe Post, type: :model do
  describe "Post Table" do
    it{ should have_db_column(:title).of_type(:string).with_options(null: false) }
    it{ should have_db_column(:user_id).of_type(:uuid).with_options(null: false) }
    it{ should have_db_column(:scope).of_type(:text).with_options(null: false)}
    it{ should validate_inclusion_of(:scope).in_array(%w(public private)) }
    it{ should have_db_column(:status).of_type(:text).with_options(null: false) }
    it{ should validate_inclusion_of(:status).in_array(%w[published video_process failed drafted archived deleted]) }
    it{ should have_db_column(:content_category_id).of_type(:uuid).with_options(null: false) }
    it{ should have_rich_text(:description) }
  end

  it "is valid with valid data" do
    post = build(:post, :blog, :scope_public, :status_published)

    expect(post).to be_valid
  end

  it "is valid with correct description" do
    post = create(:post, :blog, :scope_public, :status_published)
    post.description = "<p>Testing description</p>"
    post.save!

    expect(post.description.body.to_html).to eq("<p>Testing description</p>")
  end

  it "is valid to fetch with_description" do
    create(:post, :blog, :scope_public, :status_published)
    fetched_post = Post.with_description.first

    expect(fetched_post.body).to eq("<p>This is a temp description</p>")
  end  

  # TODO: Specs for image and video posts - Need to think should we need to do it or not.
end
