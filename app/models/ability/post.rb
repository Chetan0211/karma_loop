class Ability::Post
  include CanCan::Ability
  def initialize(user)
    #TODO: Need to re evaluate these because there are some miss understanding while creating these authorizations
    can :create , Post
    can :read, Post, status: "published", scope: :public
    can :read, Post, user_id: user.id
    can :read, Post, status: "published", user:{ group_users: { user_id: user.id, status: "follower", group:{ type: "friend" }}}
    can [:update, :destroy], Post, user_id: user.id

    can [:create, :read], Comment, post:{user: {status: "published", scope: "public"}}
    can [:create, :read], Comment, post:{user: {status: "published", group_users: {user_id: user.id, status: "follower", group:{type: "friend"}}}}
    can [:update], Comment, commenter_id: user.id
    can [:destroy], Comment, commenter_id: user.id
    can [:destroy], Comment, post: {user_id: user.id}
  end
end