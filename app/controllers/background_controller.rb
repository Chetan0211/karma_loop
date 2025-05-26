# Temporary controller to run background jobs manually
class BackgroundController < ApplicationController
  def video_transcode
    posts = Post.where(content_type: "video", status: "video_process")
    posts.each do |post|
      TranscodeVideoJob.perform_later(post_id: post.id)
    end
    render json: { success: true }
  end
end
