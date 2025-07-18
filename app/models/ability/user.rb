class Ability::User
  include CanCan::Ability
  def initialize(user)
    can :manage, User, id: user.id
    can :read, User
    can :read_posts, User, scope: :public
    can :read_posts, User, id: user.all_following.pluck(:id)
    can :request_friend, User
    cannot :request_friend, User, id: user.blocked_from_users.pluck(:id)

    can :manage, Group, id: get_user_groups(user)
  end

  private

  def get_user_groups(user)
    GroupUser.where(group_users:{user_id: user.id}).pluck(:group_id).uniq
  end
end