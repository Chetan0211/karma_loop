class Ability::User
  include CanCan::Ability
  def initialize(user)
    can :manage, User, id: user.id
    can :read, User
    can :read_posts, User, scope: :public
    can :read_posts, User, id: user.all_following.pluck(:id)
  end
end