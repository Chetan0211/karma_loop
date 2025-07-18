class CreateChats < ActiveRecord::Migration[7.1]
  def change
    create_table :chats, id: :uuid do |t|
      t.uuid :user_id, null: false
      t.uuid :group_id, null: false
      t.uuid :reply_to_id, null: true
      t.text :message, null: false
      t.timestamps
    end

    add_foreign_key :chats, :users, column: :user_id
    add_foreign_key :chats, :groups, column: :group_id
    add_foreign_key :chats, :chats, column: :reply_to_id

    add_index :chats, :user_id
    add_index :chats, :group_id

  end
end
