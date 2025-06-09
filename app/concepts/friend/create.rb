class Friend::Create < Trailblazer::Operation
  step :prepare_data
  step :fetch_or_create_group
  step :follow_request

  def prepare_data(result, params:, **)
    result[:from] = User.find(params[:from]).includes(:group_users)
    result[:to] = User.find(params[:to]).includes(group_users: :group)
  end

  def fetch_or_create_group(result, **)
    result[:group] = null
    group_user = result[:to].group_users.where(group:{id: result[:from].group_users.pluck(:group_id), type: "friend"}, user_id: result[:from].id).first
    if group_user.present?
      result[:group] = group_user.group
    else
      result[:group] = Group.create(type: "friend")
      GroupUser.create(user_id: result[:from].id, group_id: result[:group].id, status: "non_follower")
      GroupUser.create(user_id: result[:to].id, group_id: result[:group].id, status: "non_follower")
    end
  end
  def follow_request(result, **)
    group_user = GroupUser.find_by(group_id: result[:group].id, user_id: result[:from].id)
    if result[:to].scope == "public"
      group_user.update(status: "follower")
    else
      group_user.update(status: "requested")
    end
  end
end