class MessageInteraction::Create < Trailblazer::Operation
  step :setup_model
  step Contract::Build(constant: MessageInteraction::Contract::Create)
  step Contract::Validate()
  step Contract::Persist()

  def setup_model(result, params:, **)
    interaction = MessageInteraction.find_by(chat_id: params[:chat_id], user_id: params[:user_id])
    if interaction.present?
      result[:model] = interaction
      result[:model].reaction = params[:reaction]
    else
      result[:model] = MessageInteraction.new(params)
    end
  end
end