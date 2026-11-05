class AddLastSeenAtToUsers < ActiveRecord::Migration[7.1]
  def change
    # When the user last had the app open; shown as "Last seen ..." while they are offline
    add_column :users, :last_seen_at, :datetime
  end
end
