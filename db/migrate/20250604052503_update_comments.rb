class UpdateComments < ActiveRecord::Migration[7.1]
  def change
    remove_column :comments, :likes
    remove_column :comments, :dislikes
  end
end
