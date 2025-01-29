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
    @post.content_category = ContentCategory.find_by(category: "Test")
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
    result = Post::Reaction.call(post_reaction: reaction)
    if result.success?
      head :ok
    else
      head :bad_request
      Turbo::StreamsChannel.broadcast_update_to(
          "#{user.id}error_notifications",
          target: "error-notifications",
          partial: "shared/error_message",
          locals: { message: "Something went wrong. Can't able to react to the post" }
        )
    end
  end

  def post_reaction_remove
    
  end

  def comment_reaction
    reaction = CommentReaction.new
    reaction.post_id = params[:post_id]
    reaction.comment_id = params[:comment_id]
    reaction.user_id = current_user.id
    reaction.reaction = params[:reaction]
    if reaction.save!
      head :no_content
    else
      head :no_content
    end
  end

  private 

  def post_params
    params.require(:post).permit(:title, :description)
  end

  def comment_params
    params.require(:comment).permit(:comment, :parent_id)
  end

end
