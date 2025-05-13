class Post::Create < Trailblazer::Operation
  step :setup_model
  step Contract::Build(constant: Post::Contract::Create)
  step Contract::Validate()
  step Contract::Persist()

  def setup_model(options, params:, **)
    #TODO: Once we start implementing images and videos this code has to change
    options[:model] = Post.new(params)
  end
end