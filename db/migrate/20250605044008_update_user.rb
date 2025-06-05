class UpdateUser < ActiveRecord::Migration[7.1]
  def change
    remove_column :users, :description
  end
end
