class RemoveDesciprionToPosts < ActiveRecord::Migration[7.1]
  def change
    remove_column :posts, :description, :text
  end
end
