class UpdateScopeDefaultInUsers < ActiveRecord::Migration[7.1]
  def change
    change_column_default :users, :scope, from: "public", to: "private"
  end
end
