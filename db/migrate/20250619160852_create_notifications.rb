class CreateNotifications < ActiveRecord::Migration[7.1]
  def change
    create_table :notifications, id: :uuid do |t|
      t.uuid :notification_event_id, null: false
      t.string :recipient_type, null: false
      t.uuid :recipient_id, null: false
      t.datetime :read_at, null: true
      t.timestamps
    end

    add_foreign_key :notifications, :notification_events, column: :notification_event_id
    add_index :notifications, :notification_event_id
    add_index :notifications, :recipient_id
    add_index :notifications, :recipient_type
  end
end
