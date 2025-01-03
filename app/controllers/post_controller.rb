class PostController < ApplicationController
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
    @post = Post.find(params[:id])
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

  private 

  def post_params
    params.require(:post).permit(:title, :description)
  end

  def comment_params
    params.require(:comment).permit(:comment, :parent_id)
  end

end
