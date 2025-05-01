class Post::ReactionDelete < Trailblazer::Operation
  step :delete_reaction
  step :update_count
  

  def delete_reaction(options, post_reaction:, **)
    post_reaction = PostsReaction.find_by(
      post_id: post_reaction[:post_id],
      user_id: post_reaction[:user_id]
    )
    post_reaction.destroy if post_reaction.present?
  end


  def update_count(options, **)
    post = Post.find(options[:post_reaction][:post_id])
    reactions = PostsReaction.where(post_id: post.id)
    likes = reactions.where(reaction: 'like').count
    dislikes = reactions.where(reaction: 'dislike').count
    post.update(likes: likes, dislikes: dislikes)
  end
end