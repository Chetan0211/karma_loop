class Ability::Post
  include CanCan::Ability
  def initialize(user)
    can [:manage, :create_comment, :read_comment], Post, user_id: user.id
    can [:read, :create_comment, :read_comment], Post, status: "published", scope: :public, deleted_at: nil
    can [:read, :create_comment, :read_comment], Post, status: "published", user_id: user.all_following.pluck(:id), deleted_at: nil

    can [:update_comment, :destroy_comment], Comment, commenter_id: user.id
    can [:destroy_comment], Comment, post: {user_id: user.id}
  end
end