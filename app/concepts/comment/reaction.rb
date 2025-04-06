class Comment::Reaction < Trailblazer::Operation
  step :model_setup
  step Contract::Build(constant: Comment::Contract::Reaction)
  step Contract::Validate()
  step Contract::Persist()
  step :update_count

  def model_setup(options, comment_reaction:, **)
    options[:model] = CommentsReaction.find_or_initialize_by(
      post_id: comment_reaction[:post_id],
      user_id: comment_reaction[:user_id],
      comment_id: comment_reaction[:comment_id]
    )
    options[:model].reaction = comment_reaction[:reaction]
  end

  def update_count(options, **)
    comment = Comment.find(options[:comment_reaction][:comment_id])
    likes = CommentsReaction.where(comment_id: comment.id, reaction: 'like').count
    dislikes = CommentsReaction.where(comment_id: comment.id, reaction: 'dislike').count
    comment.update(likes: likes, dislikes: dislikes)
  end
end