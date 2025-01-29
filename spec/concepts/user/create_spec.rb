require 'rails_helper'

RSpec.describe User::Create do
  it "is valid with valid data" do
    user_params = {
      username: "username_01",
      email: "testuser@gmail.com",
      password: "Chtingiagem@0132!32",
      password_confirmation: "Chtingiagem@0132!32",
      dob: "2000-02-10"
    }
    result = User::Create.call(params: user_params)
    expect(result).to be_success
  end

  describe "with invalid parameters" do
    context "invalid username" do
      it "is already present" do
        create(:user, username: "username_01")
        user_params = {
          username: "username_01",
          email: "testuser@gmail.com",
          password: "Chtingiagem@0132!32",
          password_confirmation: "Chtingiagem@0132!32",
          dob: "2000-02-10"
        }
    
        result = User::Create.call(params: user_params)
        expect(result).to be_failure
        expect(result['contract.default'].errors[:username]).to include("This username is already taken.")
      end

      it "is empty" do
        user_params = {
          username: "",
          email: "testuser@gmail.com",
          password: "Chtingiagem@0132!32",
          password_confirmation: "Chtingiagem@0132!32",
          dob: "2000-02-10"
        }

        result = User::Create.call(params: user_params)
        expect(result).to be_failure
        expect(result['contract.default'].errors[:username]).to include("Username can't be blank.")
      end

      it "is not in correct format" do
        user_params = {
          username: "username!@$",
          email: "testuser@gmail.com",
          password: "Chtingiagem@0132!32",
          password_confirmation: "Chtingiagem@0132!32",
          dob: "2000-02-10"
        }

        result = User::Create.call(params: user_params)
        expect(result).to be_failure
        expect(result['contract.default'].errors[:username]).to include("Username is not in the given format.")
      end
    end

    context "invalid email" do
      it "is empty" do
        user_params = {
          username: "username_01",
          email: "",
          password: "Chtingiagem@0132!32",
          password_confirmation: "Chtingiagem@0132!32",
          dob: "2000-02-10"
        }
        result = User::Create.call(params: user_params)
        expect(result).to be_failure
        expect(result['contract.default'].errors[:email]).to include("Email can't be blank.")
      end

      it "is already present" do
        create(:user, email: "testuser@gmail.com")
        user_params = {
          username: "username_01",
          email: "testuser@gmail.com",
          password: "Chtingiagem@0132!32",
          password_confirmation: "Chtingiagem@0132!32",
          dob: "2000-02-10"
        }
        result = User::Create.call(params: user_params)
        expect(result).to be_failure
        expect(result['contract.default'].errors[:email]).to include("We already have an account with this email.")
      end

      it "is not valid" do
        user_params = {
          username: "username_01",
          email: "testuser1212dds",
          password: "Chtingiagem@0132!32",
          password_confirmation: "Chtingiagem@0132!32",
          dob: "2000-02-10"
        }
        result = User::Create.call(params: user_params)
        expect(result).to be_failure
        expect(result['contract.default'].errors[:email]).to include("Email is not in a valid format.")
      end
    end

    context "invalid password" do
      it "is empty" do
        user_params = {
          username: "username_01",
          email: "testuser@gmail.com",
          password: "",
          password_confirmation: "Chtingiagem@0132!32",
          dob: "2000-02-10"
        }

        result = User::Create.call(params: user_params)
        expect(result).to be_failure
        expect(result['contract.default'].errors[:password]).to include("Password can't be blank.")
      end

      it "is not valid" do
        user_params = {
          username: "username_01",
          email: "testuser1212dds",
          password: "123456",
          password_confirmation: "123456",
          dob: "2000-02-10"
        }
        result = User::Create.call(params: user_params)
        expect(result).to be_failure
        expect(result['contract.default'].errors[:password]).to include("Password is not in a valid format.")
      end

      it "and confirm password dosen't match" do
        user_params = {
          username: "username_01",
          email: "testuser1212dds",
          password: "Cagsheuemn32!234",
          password_confirmation: "Cagsscheuemn32!234",
          dob: "2000-02-10"
        }
        result = User::Create.call(params: user_params)
        expect(result).to be_failure
        expect(result['contract.default'].errors[:password_confirmation]).to include("Your password and confirm password should match.")
      end
    end

    it "has empty DOB" do
      user_params = {
        username: "username_01",
        email: "testuser@gmail.com",
        password: "Chtingiagem@0132!32",
        password_confirmation: "Chtingiagem@0132!32",
        dob: ""
      }

      result = User::Create.call(params: user_params)
      expect(result).to be_failure
      expect(result['contract.default'].errors[:dob]).to include("Date of birth can't be blank.")
    end
  end
end