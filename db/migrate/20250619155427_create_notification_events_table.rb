class CreateNotificationEventsTable < ActiveRecord::Migration[7.1]
  def change
    create_table :notification_events, id: :uuid do |t|
      t.string :type, null: false
      t.string :record_type, null: false
      t.uuid :record_id, null: false
      t.jsonb :params
      t.integer :notifications_count, default: 0
      t.timestamps
    end

    add_index :notification_events, :record_id
    add_index :notification_events, :record_type
  end
end
