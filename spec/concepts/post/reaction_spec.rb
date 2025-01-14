require "rails_helper"

RSpec.describe Post::Reaction do
  it "is valid with valid data" do
    post = create(:post)
    user = create(:user)
    posts_reaction = {
      post_id: post.id,
      user_id: user.id,
      reaction: "like"
    }

    result = Post::Reaction.call(posts_reaction: posts_reaction)
    expect(result).to be_success
    expect(PostsReaction.count).to eq(1)
  end

  context "with invalid data" do
    it "is invalid with empty post id" do
      user = create(:user)
      posts_reaction = {
        post_id: "",
        user_id: user.id,
        reaction: "like"
      }

      result = Post::Reaction.call(posts_reaction: posts_reaction)
      expect(result).to be_failure
      expect(PostsReaction.count).to eq(0)
    end

    it "is invalid with empty user id" do
      post = create(:post)
      posts_reaction = {
        post_id: post.id,
        user_id: "",
        reaction: "like"
      }

      result = Post::Reaction.call(posts_reaction: posts_reaction)
      expect(result).to be_failure
      expect(PostsReaction.count).to eq(0)
    end

    it "is invalid with empty reaction" do
      post = create(:post)
      user = create(:user)
      posts_reaction = {
        post_id: post.id,
        user_id: user.id,
        reaction: ""
      }

      result = Post::Reaction.call(posts_reaction: posts_reaction)
      expect(result).to be_failure
      expect(PostsReaction.count).to eq(0)
    end

    it "is invalid with some other reaction" do
      post = create(:post)
      user = create(:user)
      posts_reaction = {
        post_id: post.id,
        user_id: user.id,
        reaction: "something"
      }

      result = Post::Reaction.call(posts_reaction: posts_reaction)
      expect(result).to be_failure
      expect(PostsReaction.count).to eq(0)
    end
  end
end