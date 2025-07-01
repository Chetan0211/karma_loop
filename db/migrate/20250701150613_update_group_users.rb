class UpdateGroupUsers < ActiveRecord::Migration[7.1]
  def change
    add_column :group_users, :last_read_chat_id, :uuid, null: true
    add_column :group_users, :last_read_at, :datetime, null: true
  end
end
