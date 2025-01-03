class RemoveCommentInCommentTable < ActiveRecord::Migration[7.1]
  def change
    remove_column :comments, :comment, :text
  end
end
