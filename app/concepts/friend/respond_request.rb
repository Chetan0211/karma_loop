class Friend::RespondRequest < Trailblazer::Operation
  step :prepare_data
  step :respond_request
  step :send_notifications
  step :update_ui

  def prepare_data(result, params:, **)
    result[:from] = User.find(params[:from])
    result[:to] = User.find(params[:to])
    result[:status] = params[:status]
    result[:group_user] = result[:to].group_users.includes(:group).where(group:{id: result[:from].group_users.pluck(:group_id), type: "friend"}).first
    result[:group] = result[:group_user].group
  end

  def respond_request(result, **)
    if result[:group_user].status == "requested" && result[:status] == "accept"
      result[:group_user].update(status: "follower")
    elsif result[:group_user].status == "requested" && result[:status] == "decline"
      result[:group_user].update(status: "non_follower")
    else
      return false
    end
  end

  def send_notifications(result, **)
    Notification::AcceptFriendRequestNotification.with(record: result[:from],from: result[:from], to: result[:to], group: result[:group], group_user: result[:group_user]).deliver_later(result[:to]) if result[:status] == "accept"
    true
  end

  def update_ui(result, **)
    Turbo::StreamsChannel.broadcast_render_to("ui_#{result[:from].id}", 
      template: "friends/request_response", 
      locals:{send_to: result[:from], from: result[:from], to: result[:to]},
    )
    
    Turbo::StreamsChannel.broadcast_render_to("ui_#{result[:to].id}", 
      template: "friends/request_response", 
      locals:{send_to: result[:to], from: result[:from], to: result[:to]},
    )
  end
end