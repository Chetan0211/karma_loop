class Comment::Reaction < Trailblazer::Operation
  step :model_setup
  step Contract::Build(constant: Comment::Contract::Reaction)
  step Contract::Validate()
  step Contract::Persist()

  def model_setup(options, comment_reaction:, **)
    options[:model] = CommentsReaction.find_or_initialize_by(
      post_id: comment_reaction[:post_id],
      user_id: comment_reaction[:user_id],
      comment_id: comment_reaction[:comment_id]
    )
    options[:model].reaction = comment_reaction[:reaction]
  end
end