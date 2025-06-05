# == Schema Information
#
# Table name: group_users
#
#  id         :uuid             not null, primary key
#  status     :string
#  created_at :datetime         not null
#  updated_at :datetime         not null
#  group_id   :uuid             not null
#  user_id    :uuid             not null
#
# Indexes
#
#  index_group_users_on_group_id  (group_id)
#  index_group_users_on_user_id   (user_id)
#
# Foreign Keys
#
#  fk_rails_...  (group_id => groups.id)
#  fk_rails_...  (user_id => users.id)
#
class GroupUser < ApplicationRecord
  STATUS = %w[non_follower requested follower restricted blocked].freeze

  validates :status, inclusion: { in: STATUS }

  belongs_to :group
  belongs_to :user
end
