class UpdatePostIdInCommentsReactionTable < ActiveRecord::Migration[7.1]
  def change
    change_column_null :comments_reactions, :post_id, false
  end
end
