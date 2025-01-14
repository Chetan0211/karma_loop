class User::Create < Trailblazer::Operation
  step :setup_model
  step Contract::Build(constant: User::Contract::Create)
  step Contract::Validate()

  def setup_model(result, params:, **)
    result[:model] = User.new(params.except(:password_confirmation))
  end
end