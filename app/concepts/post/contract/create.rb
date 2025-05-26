class Post::Contract::Create < ApplicationContract
  property :title
  property :description
  property :content_category_id
  property :content_type
  property :scope
  property :status

  validates :title, presence: true
  validates :content_category_id, presence: true
  validates :content_type, presence: true, inclusion: { in: %w[blog images video] }
  validates :scope, presence: true, inclusion: { in: %w[public private] }
  validates :status, presence: true, inclusion: { in: %w[published drafted video_process] }
end