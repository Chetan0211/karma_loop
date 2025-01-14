class Post::Reaction < Trailblazer::Operation
  step :setup_model
  step Contract::Build(constant: Post::Contract::Reaction)
  step Contract::Validate()
  step Contract::Persist()

  def setup_model(options, posts_reaction:, **)
    options[:model] = PostsReaction.find_or_initialize_by(
      post_id: posts_reaction[:post_id],
      user_id: posts_reaction[:user_id]
    )
    options[:model].reaction = posts_reaction[:reaction]
  end
end