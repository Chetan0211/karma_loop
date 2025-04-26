class UpdatesPosts < ActiveRecord::Migration[7.1]
  disable_ddl_transaction!
  def change
    add_column :posts, :content_type, :text, null: false, default: "post"
    add_index :posts, :content_type, algorithm: :concurrently
  end
end
