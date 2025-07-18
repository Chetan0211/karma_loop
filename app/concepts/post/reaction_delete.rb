class Post::ReactionDelete < Trailblazer::Operation
  step :delete_reaction
  

  def delete_reaction(options, post_reaction:, **)
    post_reaction = PostsReaction.find_by(
      post_id: post_reaction[:post_id],
      user_id: post_reaction[:user_id]
    )
    post_reaction.destroy if post_reaction.present?
  end
end