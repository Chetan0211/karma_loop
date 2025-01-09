class AddLikeColumnToCommentTable < ActiveRecord::Migration[7.1]
  def change
    add_column :comments, :likes, :integer, default: 0, null: false
    add_column :comments, :dislikes, :integer, default: 0, null: false
  end
end
