class CreateMessageInteractions < ActiveRecord::Migration[7.1]
  def change
    create_table :message_interactions, id: :uuid do |t|
      t.uuid :chat_id, null: false
      t.uuid :user_id, null: false
      t.string :reaction
      t.datetime :read_at, null: true
      t.timestamps
    end

    add_foreign_key :message_interactions, :chats, column: :chat_id
    add_foreign_key :message_interactions, :users, column: :user_id

    add_index :message_interactions, :chat_id
    add_index :message_interactions, :user_id
  end
end

