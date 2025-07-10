# == Schema Information
#
# Table name: groups
#
#  id          :uuid             not null, primary key
#  description :string
#  name        :string
#  type        :string
#  created_at  :datetime         not null
#  updated_at  :datetime         not null
#  admin_id    :uuid
#
# Indexes
#
#  index_groups_on_admin_id  (admin_id)
#  index_groups_on_type      (type)
#
# Foreign Keys
#
#  fk_rails_...  (admin_id => users.id)
#
class Group < ApplicationRecord
  self.inheritance_column = :_type_disabled # because we use type as column, it is disabled

  TYPES = %w[friend group community].freeze
  validates :type, inclusion: { in: TYPES }
  
  has_one_attached :group_picture
  belongs_to :admin, class_name: "User", optional: true
  has_many :group_users, dependent: :destroy
  has_many :chats

  def member(current_user)
    User.includes(group_users: :group).where(group_users:{group_id: self.id}).where.not(group_users:{user_id: current_user.id}).first
  end
end
