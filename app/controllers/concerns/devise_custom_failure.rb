class DeviseCustomFailure < Devise::FailureApp
  def respond
    flash[:error] = i18n_message
    if request.format.json? || request.xhr?
      self.response_body = {error: i18n_message, redirect_url: redirect_url }.to_json
    else
      # Fallback for traditional HTML forms      
      redirect_to redirect_url
    end
  end
end