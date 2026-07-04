class User::UpdatePassword < Trailblazer::Operation
  step :setup_model!
  step Contract::Build(constant: User::Contract::UpdatePassword)
  step Contract::Validate()
  step Contract::Persist()

  private

  def setup_model!(result, params: , **options)
    result["model"] = User.find_by(reset_password_token: params[:reset_password_token])
    return false if result["model"].nil?
    result["model"].password = params[:password]
    result["model"].reset_password_token = nil
    result["model"].reset_password_sent_at = nil
    result["model"].public_key = params[:public_key]
    result["model"].encrypted_key = params[:encrypted_key]
    result["model"].last_key_reset_at = DateTime.now if options[:skip_rescue_key]
  end
end