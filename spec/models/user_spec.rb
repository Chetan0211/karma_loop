# == Schema Information
#
# Table name: users
#
#  id                     :uuid             not null, primary key
#  bio                    :string(200)
#  confirmation_sent_at   :datetime
#  confirmation_token     :string
#  confirmed_at           :datetime
#  deleted_at             :datetime
#  display_name           :string(30)       not null
#  dob                    :datetime         not null
#  email                  :string           default(""), not null
#  encrypted_key          :string           not null
#  encrypted_password     :string           default(""), not null
#  is_admin               :boolean          default(FALSE), not null
#  last_key_reset_at      :datetime
#  public_key             :string           not null
#  remember_created_at    :datetime
#  reset_password_sent_at :datetime
#  reset_password_token   :string
#  scope                  :string           default("public"), not null
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

  describe "followers and following" do
    let!(:create_user_list){create_list(:user, 10)}
    let!(:create_group_list){create_list(:group, 9, :group_friend)}
    let!(:following_count) { 7 }
    let!(:block_count){2}
    let!(:follower_count){5}
    let!(:base_user){create_user_list[0]}
    let!(:group_users_list){
      group_users = []
      (0..8).to_a.each do |i|
        if i < following_count
          group_users << create(:group_user, user_id: base_user.id, group_id: create_group_list[i].id, status: "follower")
        elsif follower_count<= i && i < following_count+block_count
          group_users << create(:group_user, user_id: base_user.id, group_id: create_group_list[i].id, status: "blocked")
        else
          group_users << create(:group_user, user_id: base_user.id, group_id: create_group_list[i].id, status: "non_follower")
        end

        if i < follower_count
          group_users << create(:group_user, user_id: create_user_list[i+1].id, group_id: create_group_list[i].id, status: "follower")
        else 
          group_users << create(:group_user, user_id: create_user_list[i+1].id, group_id: create_group_list[i].id, status: "non_follower")
        end
      end
      group_users
    }

    it "valid followers" do
      expect(base_user.all_followers.count).to eq(follower_count)
    end

    it "valid following" do
      expect(base_user.all_following.count).to eq(following_count)
    end

    it "valid blocked users" do
      expect(base_user.all_blocked_users.count).to eq(block_count)
    end
  end
end
