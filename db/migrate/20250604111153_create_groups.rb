class CreateGroups < ActiveRecord::Migration[7.1]
  def change
    create_table :groups, id: :uuid do |t|
      t.string :type
      t.string :name
      t.uuid :admin_id, null: true
      t.string :description
      t.timestamps
    end
    add_foreign_key :groups, :users, column: :admin_id
    add_index :groups, :admin_id
    add_index :groups, :type

    create_table :group_users, id: :uuid do |t|
      t.uuid :group_id, null: false
      t.uuid :user_id, null: false
      t.string :status
      t.timestamps
    end

    add_foreign_key :group_users, :groups, column: :group_id
    add_foreign_key :group_users, :users, column: :user_id

    add_index :group_users, :group_id
    add_index :group_users, :user_id
    
  end
end