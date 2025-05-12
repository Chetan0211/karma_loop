# == Schema Information
#
# Table name: users
#
#  id                     :uuid             not null, primary key
#  confirmation_sent_at   :datetime
#  confirmation_token     :string
#  confirmed_at           :datetime
#  deleted_at             :datetime
#  description            :text
#  display_name           :string(30)       not null
#  dob                    :datetime         not null
#  email                  :string           default(""), not null
#  encrypted_password     :string           default(""), not null
#  is_admin               :boolean          default(FALSE), not null
#  remember_created_at    :datetime
#  reset_password_sent_at :datetime
#  reset_password_token   :string
#  unconfirmed_email      :string
#  username               :string           not null
#  created_at             :datetime         not null
#  updated_at             :datetime         not null
#
# Indexes
#
#  index_users_on_confirmation_token    (confirmation_token) UNIQUE
#  index_users_on_display_name          (display_name)
#  index_users_on_email                 (email) UNIQUE
#  index_users_on_reset_password_token  (reset_password_token) UNIQUE
#  index_users_on_username              (username) UNIQUE
#
require 'rails_helper'

RSpec.describe User, type: :model do
  describe "User table" do
    it{ should have_db_column(:username).of_type(:string) }
    it{ should have_db_column(:email).of_type(:string) }
    it{ should have_db_column(:dob).of_type(:datetime).with_options(null: false) }

    it{ should have_db_index(:username).unique(true) }
    it{ should have_db_index(:email).unique(true) }
  end

  it "is valid with valid attributes" do 
    user = build(:user)
    expect(user).to be_valid
  end

  it "is not valid with same username" do
    create(:user, username:"testuser")
    user = build(:user, username:"testuser")
    expect(user).not_to be_valid
  end

  it "is not valid with same email" do
    create(:user, email:"example@gmail.com")
    user = build(:user, email:"example@gmail.com")
    expect(user).not_to be_valid
  end

  it "is not valid with empty username" do
    user = build(:user, username:"")
    expect(user).not_to be_valid
  end

  it "is not valid with empty password" do
    user = build(:user, password:"")
    expect(user).not_to be_valid
  end

  it "is not valid with empty email" do
    user = build(:user, email:"")
    expect(user).not_to be_valid
  end
end
