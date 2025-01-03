class CreatePosts < ActiveRecord::Migration[7.1]
  def change
    create_table :posts, id: :uuid do |t|
      t.string :title, null: false
      t.text :description, null: true
      t.uuid :user_id, null: false
      t.uuid :content_category_id, null: false
      t.integer :likes, default: 0, null: false
      t.integer :dislikes, default: 0, null: false
      t.datetime :deleted_at, null:true
      t.timestamps
    end

    add_foreign_key :posts, :users, column: :user_id
    add_foreign_key :posts, :content_categories, column: :content_category_id
    add_index :posts, :content_category_id
    add_index :posts, :user_id
  end
end
