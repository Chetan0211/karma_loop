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
#  encrypted_password     :string           default(""), not null
#  is_admin               :boolean          default(FALSE), not null
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

  def following
    group = Group.includes(:group_users).where(type:"friend", group_users:{user_id: self.id, status: "follower"}).pluck(:group_id);
    User.includes(:group_users).where(group_users:{group_id: group}).where.not(id: self.id);
  end
  def followers
    User.includes(:group_users).where(group_users:{group_id: friend_groups, status:"follower"}).where.not(id: self.id);
  end
  def blocked_users
    group = Group.includes(:group_users).where(type:"friend", group_users:{user_id: self.id, status: "blocked"}).pluck(:group_id);
    User.includes(:group_users).where(group_users:{group_id: group}).where.not(id: self.id);
  end

  def friend_requests
    User.includes(:group_users).where(group_users:{group_id: friend_groups, status:"requested"}).where.not(id: self.id);
  end

  def requested
    group = Group.includes(:group_users).where(type:"friend", group_users:{user_id: self.id, status: "requested"}).pluck(:group_id);
    User.includes(:group_users).where(group_users:{group_id: group}).where.not(id: self.id);
  end
  
  private

  def friend_groups
    Group.includes(:group_users).where(type:"friend",group_users:{user_id: self.id}).pluck(:group_id);
  end
  def chat_groups
    Group.includes(:group_users).where(type:"group",group_users:{user_id: self.id}).pluck(:group_id);
  end
  def community_groups
    Group.includes(:group_users).where(type:"community",group_users:{user_id: self.id}).pluck(:group_id);
  end
end
