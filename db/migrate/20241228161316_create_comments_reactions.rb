class CreateCommentsReactions < ActiveRecord::Migration[7.1]
  def change
    create_table :comments_reactions, id: :uuid do |t|
      t.uuid :comment_id, null: false
      t.uuid :user_id, null: false
      t.string :reaction, null: false
      t.timestamps
    end

    add_foreign_key :comments_reactions, :comments, column: :comment_id, on_delete: :cascade
    add_foreign_key :comments_reactions, :users, column: :user_id

    add_index :comments_reactions, :comment_id
    add_index :comments_reactions, :user_id
  end
end
