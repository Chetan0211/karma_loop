class MessageInteraction::Create < Trailblazer::Operation
  step :setup_model
  step Contract::Build(constant: MessageInteraction::Contract::Create)
  step Contract::Validate()
  step Contract::Persist()

  def setup_model(result, params:, **)
    # Reads and reactions share one row per user; the contract only updates the keys present in params,
    # so marking a message as read keeps the reaction and reacting keeps read_at.
    result[:model] = MessageInteraction.find_or_initialize_by(chat_id: params[:chat_id], user_id: params[:user_id])
  end
end