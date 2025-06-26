class Friend::Unfollow < Trailblazer::Operation
  step :prepare_data
  step :unfollow_user
  step :update_ui

  def prepare_data(result, params:, **)
    result[:from] = User.find(params[:from])
    result[:to] = User.find(params[:to])
    result[:group_user] = result[:from].group_users.includes(:group).where(group:{id: result[:to].group_users.pluck(:group_id), type: "friend"}).first
  end

  def unfollow_user(result, **)
    if result[:group_user].status == "follower" || result[:group_user].status == "requested"
      result[:group_user].update(status: "non_follower")
    else
      return false
    end
  end

  def update_ui(result, **)
    Turbo::StreamsChannel.broadcast_render_to("ui_#{result[:from].id}", 
      template: "friends/unfollow_friend", 
      locals:{send_to: result[:from], from: result[:from], to: result[:to]},
    )
    
    Turbo::StreamsChannel.broadcast_render_to("ui_#{result[:to].id}", 
      template: "friends/unfollow_friend", 
      locals:{send_to: result[:to], from: result[:from], to: result[:to]},
    )
  end
end