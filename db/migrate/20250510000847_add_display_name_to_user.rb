class AddDisplayNameToUser < ActiveRecord::Migration[7.1]
  def change
    add_column :users, :display_name, :string, null: false, default: "Anonymous", limit: 30
    add_index :users, :display_name
    change_column_default :users, :display_name, from: 'Anonymous', to: nil
  end
end
