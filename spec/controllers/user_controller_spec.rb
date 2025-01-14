require 'rails_helper'

RSpec.describe User, type: :request do
  describe 'GET /profile/:id' do
    it "is valid with status ok" do
      user = create(:user)

      sign_in user

      get user_profile_path(id: user.id)

      expect(response).to have_http_status(:ok)
      expect(response.body).to include(user.username)
    end
  end
end