class CreateComments < ActiveRecord::Migration[7.1]
  def change
    create_table :comments, id: :uuid do |t|
      t.uuid :commenter_id, null: false
      t.uuid :post_id, null: false
      t.text :comment, null: false
      t.uuid :parent_id, null: true
      t.timestamps
    end

    add_foreign_key :comments, :users, column: :commenter_id
    add_foreign_key :comments, :posts, column: :post_id
    add_foreign_key :comments, :comments, column: :parent_id, on_delete: :cascade
  end
end
