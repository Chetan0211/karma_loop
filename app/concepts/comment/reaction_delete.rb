class Comment::ReactionDelete < Trailblazer::Operation
  step :delete_reaction
  step :update_count
  
  def delete_reaction(options, comment_reaction:, **)
    comment_reaction = CommentsReaction.find_by(
      post_id: comment_reaction[:post_id],
      user_id: comment_reaction[:user_id],
      comment_id: comment_reaction[:comment_id]
    )
    comment_reaction.destroy if comment_reaction.present?
  end

  def update_count(options, **)
    comment = Comment.find(options[:comment_reaction][:comment_id])
    likes = CommentsReaction.where(comment_id: comment.id, reaction: 'like').count
    dislikes = CommentsReaction.where(comment_id: comment.id, reaction: 'dislike').count
    comment.update(likes: likes, dislikes: dislikes)
  end
end