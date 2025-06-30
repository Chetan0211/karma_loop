class PostController < ApplicationController
  include SendPopupMessage

  before_action :authenticate_user!
  def index
    
  end

  def new
    @post = Post.new
    @content_categories = ContentCategory.all
  end
  
  def create
    @post = Post.new
    @content_categories = ContentCategory.all
    post_params = nil
    if params[:post]["content_type"] == "images"
      post_params = image_post_params
      post_params[:description] = params[:post]["image_description"]
    elsif params[:post]["content_type"] == "video"
      post_params = video_post_params
      post_params[:description] = params[:post]["video_description"]
    else
      post_params = blog_post_params
    end
    post_params[:user_id] = current_user.id
    post_params[:status] = params[:status]
    result = Post::Create.call(params: post_params)
    if result.success?
      flash[:success] = "Post is successfully created."
      redirect_to result[:model]
    else
      flash.now[:error] = "Some error occured. Post is not created."
      render :new, status: :unprocessable_entity
    end
  end

  def show
    @post = Post.includes(:posts_reactions).find(params[:id])
    authorize! :read, @post
  end

  def comment
    @post = Post.find(params[:post_id])
    authorize! :create_comment, @post
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
    post = Post.find(params[:post_id])
    authorize! :read, post
    reaction = {
      post_id: params[:post_id],
      user_id: current_user.id,
      reaction: params[:reaction]
    }
    result = params[:reaction] == nil ? Post::ReactionDelete.call(post_reaction: reaction) : Post::Reaction.call(post_reaction: reaction)
    if result.success?
      head :ok
    else
      head :internal_server_error
      send_error_popup(user_id: current_user.id, message: "Something went wrong. Can't able to react to the post.")
    end
  end

  def comment_reaction
    post = Post.find(params[:post_id])
    authorize! :read, post
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
      head :internal_server_error
      send_error_popup(user_id: current_user.id, message: "Something went wrong. Can't able to react to the comment.")
    end
  end

  private 

  def blog_post_params
    params.require(:post).permit(:title, :description, :content_category_id, :content_type)
  end

  def image_post_params
    params.require(:post).permit(:title, :content_category_id, :content_type, images:[])
  end

  def video_post_params
    params.require(:post).permit(:title, :content_category_id, :content_type, :video)
  end

  def comment_params
    params.require(:comment).permit(:comment, :parent_id)
  end

end
