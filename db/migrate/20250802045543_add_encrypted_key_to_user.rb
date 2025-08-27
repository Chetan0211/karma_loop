class AddEncryptedKeyToUser < ActiveRecord::Migration[7.1]
  def up
    add_column :users, :encrypted_key, :string, null: false, default:"ENCRYPTED_KEY_DEFAULT"
    add_column :users, :public_key, :string, null: false, default: "PUBLIC_KEY_DEFAULT"
    add_column :users, :last_key_reset_at, :datetime
    change_column_default :users, :encrypted_key, nil
    change_column_default :users, :public_key, nil
  end

  def down
    remove_column :users, :encrypted_key
    remove_column :users, :public_key
    remove_column :users, :last_key_reset_at
  end
end
