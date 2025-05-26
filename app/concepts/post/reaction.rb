class Post::Reaction < Trailblazer::Operation
  step :setup_model
  step Contract::Build(constant: Post::Contract::Reaction)
  step Contract::Validate()
  step Contract::Persist()
  
  def setup_model(options, post_reaction:, **)
    options[:model] = PostsReaction.find_or_initialize_by(
      post_id: post_reaction[:post_id],
      user_id: post_reaction[:user_id]
    )
    options[:model].reaction = post_reaction[:reaction]
  end
end