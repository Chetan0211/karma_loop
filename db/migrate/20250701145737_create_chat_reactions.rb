class CreateChatReactions < ActiveRecord::Migration[7.1]
  def change
    create_table :chat_reactions, id: :uuid do |t|
      t.uuid :chat_id, null: false
      t.uuid :user_id, null: false
      t.string :reaction
      t.timestamps
    end

    add_foreign_key :chat_reactions, :chats, column: :chat_id
    add_foreign_key :chat_reactions, :users, column: :user_id

    add_index :chat_reactions, :chat_id
    add_index :chat_reactions, :user_id
    add_index :chat_reactions, :reaction
  end
end
