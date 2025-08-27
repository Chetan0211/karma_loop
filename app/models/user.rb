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
class User < ApplicationRecord
  SCOPE = %w[public private].freeze

  searchkick word_start: [:username, :name]
  # Include default devise modules. Others available are:
  # :confirmable, :lockable, :timeoutable, :trackable and :omniauthable
  has_many :notifications, as: :recipient
  has_one_attached :profile_picture
  has_many :groups, class_name: "Group", foreign_key: "admin_id"
  has_many :group_users
  validates :username, 
    presence: true,
    uniqueness: { case_sensitive: true }
  
  validates :scope, inclusion: { in: SCOPE }

  devise :database_authenticatable, :registerable,
         :recoverable, :rememberable, :validatable, :confirmable

  has_many :posts, dependent: :destroy
  has_many :comments, dependent: :destroy, inverse_of: :commenter

  def search_data
    {
      username: username,
      name: display_name,
      user_deleted: deleted_at.present?
    }
  end

  def all_following
    group = friend_groups_with_status("follower")
    User.includes(:group_users).where(group_users:{group_id: group}).where.not(id: self.id)
  end

  def all_chat_groups
    Group.where(type: %w[friend group]).joins(:group_users).where(group_users:{user_id: self.id}).left_joins(:chats).group("groups.id").order('MAX(chats.created_at) DESC NULLS LAST')
  end

  def following?(user)
    group = friend_groups_with_status("follower");
    GroupUser.where(group_id: group, user_id: user.id).present?
  end

  def all_followers
    User.includes(:group_users).where(group_users:{group_id: friend_groups, status:"follower"}).where.not(id: self.id)
  end

  def follower?(user)
    GroupUser.where(group_id: friend_groups, user_id: user.id, status:"follower").present?
  end

  def all_blocked_users
    group = friend_groups_with_status("blocked");
    User.includes(:group_users).where(group_users:{group_id: group}).where.not(id: self.id)
  end

  def blocked?(user)
    group = friend_groups_with_status("blocked");
    GroupUser.where(group_id: group, user_id: user.id).present?
  end

  def blocked_from_users
    User.includes(:group_users).where(group_users:{group_id: friend_groups, status:"blocked"}).where.not(id: self.id)
  end

  def all_friend_requests
    User.includes(:group_users).where(group_users:{group_id: friend_groups, status:"requested"}).where.not(id: self.id)
  end

  def friend_request?(user)
    GroupUser.where(group_id: friend_groups, user_id: user.id, status:"requested").present?
  end

  def all_requested
    group = Group.includes(:group_users).where(type:"friend", group_users:{user_id: self.id, status: "requested"}).pluck(:group_id)
    User.includes(:group_users).where(group_users:{group_id: group}).where.not(id: self.id)
  end

  def requested?(user)
    group = friend_groups_with_status("requested");
    GroupUser.where(group_id: group, user_id: user.id).present?
  end
  
  private

  def friend_groups_with_status(group)
    Group.where(type:"friend").joins(:group_users).where(group_users:{user_id: self.id, status: group}).pluck(:group_id)
  end

  def friend_groups
    Group.where(type:"friend").joins(:group_users).where(group_users:{user_id: self.id}).pluck(:group_id)
  end
  def chat_groups
    Group.where(type:"group").joins(:group_users).where(group_users:{user_id: self.id}).pluck(:group_id)
  end
  def community_groups
    Group.where(type:"community").joins(:group_users).where(group_users:{user_id: self.id}).pluck(:group_id)
  end
end
