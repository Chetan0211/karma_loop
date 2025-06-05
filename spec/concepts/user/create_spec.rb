require 'rails_helper'

RSpec.describe User::Create do
  it "is valid with valid data" do
    user_params = build(:create_user_params)
    result = User::Create.call(params: user_params)
    expect(result).to be_success
  end

  describe "with invalid parameters" do
    context "invalid username" do
      it "is already present" do
        create(:user, username: "username_01")
        user_params = build(:create_user_params, username: "username_01")
    
        result = User::Create.call(params: user_params)
        expect(result).to be_failure
        expect(result['contract.default'].errors[:username]).to include("This username is already taken.")
      end

      it "is empty" do
        user_params = build(:create_user_params, username: "")

        result = User::Create.call(params: user_params)
        expect(result).to be_failure
        expect(result['contract.default'].errors[:username]).to include("Username can't be blank.")
      end

      it "is not in correct format" do
        user_params = build(:create_user_params, :invalid_username)

        result = User::Create.call(params: user_params)
        expect(result).to be_failure
        expect(result['contract.default'].errors[:username]).to include("Username is not in the given format.")
      end
    end

    context "invalid email" do
      it "is empty" do
        user_params = build(:create_user_params, email:"")
        result = User::Create.call(params: user_params)
        expect(result).to be_failure
        expect(result['contract.default'].errors[:email]).to include("Email can't be blank.")
      end

      it "is already present" do
        create(:user, email: "testuser@gmail.com")
        user_params = build(:create_user_params, email: "testuser@gmail.com")
        result = User::Create.call(params: user_params)
        expect(result).to be_failure
        expect(result['contract.default'].errors[:email]).to include("We already have an account with this email.")
      end

      it "is not valid" do
        user_params = build(:create_user_params, :invalid_email)
        result = User::Create.call(params: user_params)
        expect(result).to be_failure
        expect(result['contract.default'].errors[:email]).to include("Email is not in a valid format.")
      end
    end

    context "invalid password" do
      it "is empty" do
        user_params = build(:create_user_params, password: "")

        result = User::Create.call(params: user_params)
        expect(result).to be_failure
        expect(result['contract.default'].errors[:password]).to include("Password can't be blank.")
      end

      it "is not valid" do
        user_params = build(:create_user_params, :invalid_password)
        result = User::Create.call(params: user_params)
        expect(result).to be_failure
        expect(result['contract.default'].errors[:password]).to include("Password is not in a valid format.")
      end

      it "and confirm password dosen't match" do
        user_params = build(:create_user_params, password_confirmation: "Cagsscheuemn32!234")
        result = User::Create.call(params: user_params)
        expect(result).to be_failure
        expect(result['contract.default'].errors[:password_confirmation]).to include("Your password and confirm password should match.")
      end
    end

    it "has empty DOB" do
      user_params = build(:create_user_params, dob: "")

      result = User::Create.call(params: user_params)
      expect(result).to be_failure
      expect(result['contract.default'].errors[:dob]).to include("Date of birth can't be blank.")
    end
  end
end