class AddBioToUser < ActiveRecord::Migration[7.1]
  def change
    add_column :users, :bio, :string, null: true, limit: 200
  end
end
