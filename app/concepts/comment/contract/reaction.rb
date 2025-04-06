class Comment::Contract::Reaction < ApplicationContract
  property :post_id
  property :user_id
  property :comment_id
  property :reaction

  validates :post_id, presence: true
  validates :user_id, presence: true
  validates :comment_id, presence: true
  validates :reaction, inclusion: { in: %w(like dislike) }
end