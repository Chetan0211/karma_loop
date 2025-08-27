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
require "test_helper"

class UserTest < ActiveSupport::TestCase
  # test "the truth" do
  #   assert true
  # end
end
