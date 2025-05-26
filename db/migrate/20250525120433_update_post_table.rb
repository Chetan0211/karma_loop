class UpdatePostTable < ActiveRecord::Migration[7.1]
  def change
    add_column :posts, :processed_video_url, :string
    remove_column :posts, :likes
    remove_column :posts, :dislikes
  end
end
