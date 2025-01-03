class CreatePostsReactions < ActiveRecord::Migration[7.1]
  def change
    create_table :posts_reactions, id: :uuid do |t|
      t.uuid :post_id, null: false
      t.uuid :user_id, null: false
      t.string :reaction, null: false
      t.timestamps
    end
    add_foreign_key :posts_reactions, :posts, column: :post_id, on_delete: :cascade
    add_foreign_key :posts_reactions, :users, column: :user_id
    
    add_index :posts_reactions, :post_id
    add_index :posts_reactions, :user_id
  end
end
