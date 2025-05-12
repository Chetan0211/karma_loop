class User::Update < Trailblazer::Operation
  step :set_model
  step Contract::Build(constant: User::Contract::Update)
  step Contract::Validate()
  step Contract::Persist()
  step :update_profile_pic
  
  

  def set_model(result, **options)
    result[:model] = User.find(options[:user_id])
    result[:model].display_name = options[:params][:display_name]
    result[:model].bio = options[:params][:bio]
  end

  def update_profile_pic(result, **options)
    UpdateProfilePicJob.perform_now(options[:user_id],options[:params][:profile_picture], options[:params][:prev_profile_picture], options[:params][:crop_x], options[:params][:crop_y], options[:params][:crop_size])
    true
  end

end