class Post::Create < Trailblazer::Operation
  step :setup_model
  step Contract::Build(constant: Post::Contract::Create)
  step Contract::Validate()
  step :image_validation
  step Contract::Persist()

  def setup_model(result, **options)
    #TODO: Once we start implementing images and videos this code has to change
    result[:model] = Post.new(options[:params])
  end 

  def image_validation(result, **options)
    if result[:model].content_type == "images"
      if result[:model].images.blank?
        result['contract.default'].errors.add(:images, "Image can't be blank.")
        return false
      end
    end
    true
  end
end