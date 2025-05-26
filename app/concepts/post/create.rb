class Post::Create < Trailblazer::Operation
  step :setup_model
  step Contract::Build(constant: Post::Contract::Create)
  step Contract::Validate()
  step :image_validation
  step :video_validation
  step Contract::Persist()
  step :video_transcode

  def setup_model(result, **options)
    #TODO: Once we start implementing images and videos this code has to change
    options[:params][:status] = "video_process" if options[:params][:content_type] == "video"
    result[:model] = Post.new(options[:params])
  end 

  def image_validation(result, **options)
    if result[:model].content_type == "images" && result[:model].images.blank?
      result['contract.default'].errors.add(:images, "Image can't be blank.")
      return false
    end
    true
  end

  def video_validation(result, **options)
    if result[:model].content_type == "video" && result[:model].video.blank?
      result['contract.default'].errors.add(:video, "Video can't be blank.")
      return false
    end
    true
  end

  def video_transcode(result, **option)
    TranscodeVideoJob.perform_later(post_id: result[:model].id) if result[:model].content_type == "video"
    true
  end
end