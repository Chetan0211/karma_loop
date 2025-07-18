class Comment::ReactionDelete < Trailblazer::Operation
  step :delete_reaction
  
  def delete_reaction(options, comment_reaction:, **)
    comment_reaction = CommentsReaction.find_by(
      post_id: comment_reaction[:post_id],
      user_id: comment_reaction[:user_id],
      comment_id: comment_reaction[:comment_id]
    )
    comment_reaction.destroy if comment_reaction.present?
  end
end