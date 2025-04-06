class Post::Reaction < Trailblazer::Operation
  step :check_reaction
  step :delete_reaction, unless: ->(options){options[:reaction_present]}
  step :setup_model, if: ->(options){options[:reaction_present]}
  step Contract::Build(constant: Post::Contract::Reaction), if: ->(options){options[:reaction_present]}
  step Contract::Validate(), if: ->(options){options[:reaction_present]}
  step Contract::Persist(), if: ->(options){options[:reaction_present]}
  step :update_count

  def check_reaction(options, post_reaction:, **)
    options[:reaction_present] = post_reaction[:reaction] == nil ? true : false
  end

  def delete_reaction(options, post_reaction:, **)
    
  end

  def setup_model(options, post_reaction:, **)
    options[:model] = PostsReaction.find_or_initialize_by(
      post_id: post_reaction[:post_id],
      user_id: post_reaction[:user_id]
    )
    options[:model].reaction = post_reaction[:reaction]
  end

  def update_count(options, **)
    post = Post.find(options[:post_reaction][:post_id])
    likes = PostsReaction.where(post_id: post.id, reaction: 'like').count
    dislikes = PostsReaction.where(post_id: post.id, reaction: 'dislike').count
    post.update(likes: likes, dislikes: dislikes)
  end
end