class AddPostIdToCommentsReaction < ActiveRecord::Migration[7.1]
  def change
    add_column :comments_reactions, :post_id, :uuid

    add_foreign_key :comments_reactions, :posts, column: :post_id
    add_index :comments_reactions, :post_id
  end
end
