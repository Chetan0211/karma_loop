class PostController < ApplicationController
  before_action :authenticate_user!
  def index
    
  end

  def new
    @post = Post.new
    @content_categories = ContentCategory.all
  end
  
  def create
    @post = Post.new(post_params)
    @post.user = current_user
    if @post.save
      redirect_to @post, notice: 'Post was successfully created.'
    else
      render :new
    end
  end

  def show
    @post = Post.includes(:posts_reactions).find(params[:id])
  end

  def comment
    @post = Post.find(params[:post_id])
    @comment = @post.comments.build(comment_params)
    @comment.commenter = current_user
    if @comment.save
      respond_to do |format|
        format.js
      end
    else
      head :no_content
    end
  end

  def post_reaction
    reaction = {
      post_id: params[:post_id],
      user_id: current_user.id,
      reaction: params[:reaction]
    }
    result = params[:reaction] == nil ? Post::ReactionDelete.call(post_reaction: reaction) : Post::Reaction.call(post_reaction: reaction)
    if result.success?
      head :ok
    else
      head :bad_request
      Turbo::StreamsChannel.broadcast_update_to(
          "#{current_user.id}error_notifications",
          target: "error-notifications",
          partial: "shared/error_message",
          locals: { message: "Something went wrong. Can't able to react to the post" }
        )
    end
  end

  def comment_reaction
    reaction={
      post_id: params[:post_id],
      comment_id: params[:comment_id],
      user_id: current_user.id,
      reaction: params[:reaction]
    }
    result = params[:reaction] == nil ? Comment::ReactionDelete.call(comment_reaction: reaction) : Comment::Reaction.call(comment_reaction: reaction)
    if result.success?
      head :ok
    else
      head :bad_request
      Turbo::StreamsChannel.broadcast_update_to(
          "#{current_user.id}error_notifications",
          target: "error-notifications",
          partial: "shared/error_message",
          locals: { message: "Something went wrong. Can't able to react to the comment" }
        )
    end
  end

  private 

  def post_params
    params.require(:post).permit(:title, :description, :content_category_id)
  end

  def comment_params
    params.require(:comment).permit(:comment, :parent_id)
  end

end
