class UpdateUsers < ActiveRecord::Migration[7.1]
  def change
    add_column :users, :scope, :string, null: false, default: "public"
  end
end
