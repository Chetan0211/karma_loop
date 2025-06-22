class Friend::Request < Trailblazer::Operation
  step :prepare_data
  step :fetch_or_create_group
  step :follow_request
  step :send_notifications

  def prepare_data(result, params:, **)
    result[:from] = User.find(params[:from])
    result[:to] = User.find(params[:to])
  end

  def fetch_or_create_group(result, **)
    result[:group] = nil
    group_user = result[:to].group_users.includes(:group).where(group:{id: result[:from].group_users.pluck(:group_id), type: "friend"}).first
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
    if result[:to].scope == "public" && (group_user.status != "follower" || group_user.status != "requested")
      group_user.update(status: "follower")
    else
      group_user.update(status: "requested")
    end
    result[:group_user] = group_user
  end
  def send_notifications(result, **)
    Notification::FriendRequestNotification.with(record: result[:from],from: result[:from], to: result[:to], group: result[:group], group_user: result[:group_user]).deliver_later(result[:to])
  end
end