class Post::Contract::PostReaction < Reform::Form
  property :post_id
  property :user_id
  property :reaction

  validates :post_id, presence: true
  validates :user_id, presence: true
  validates :reaction, presence: true, inclusion: { in: %w[like dislike] }
end