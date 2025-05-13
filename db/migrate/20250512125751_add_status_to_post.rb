class AddStatusToPost < ActiveRecord::Migration[7.1]
  def change
    add_column :posts, :status, :text, null: false, default: "published"
    add_index :posts, :status
    add_column :posts, :scope, :text, null: false, default: "public"
    add_index :posts, :scope
    change_column_default :posts, :status, from: 'published', to: nil
  end
end
