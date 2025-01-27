class UpdateIdsInActiveStorageTables < ActiveRecord::Migration[7.1]
  def change
    remove_foreign_key :active_storage_attachments, :active_storage_blobs
    remove_foreign_key :active_storage_variant_records, :active_storage_blobs

    add_column :active_storage_blobs, :temp_id, :uuid, default: "gen_random_uuid()", null: false
    execute "ALTER TABLE active_storage_blobs DROP CONSTRAINT active_storage_blobs_pkey;"
    execute "ALTER TABLE active_storage_blobs ADD PRIMARY KEY (temp_id);"
    remove_column :active_storage_blobs, :id
    rename_column :active_storage_blobs, :temp_id, :id
    add_index :active_storage_blobs, :id

    add_column :active_storage_attachments, :temp_id, :uuid, default: "gen_random_uuid()", null: false
    execute "ALTER TABLE active_storage_attachments DROP CONSTRAINT active_storage_attachments_pkey;"
    execute "ALTER TABLE active_storage_attachments ADD PRIMARY KEY (temp_id);"
    remove_column :active_storage_attachments, :id
    rename_column :active_storage_attachments, :temp_id, :id

    
    remove_column :active_storage_attachments, :blob_id
    add_column :active_storage_attachments, :blob_id, :uuid, null: false
    add_foreign_key :active_storage_attachments, :active_storage_blobs, column: :blob_id

    remove_column :active_storage_attachments, :record_id
    add_column :active_storage_attachments, :record_id, :uuid, null: false
    add_index :active_storage_attachments, [ :record_type, :record_id, :name, :blob_id ], name: :index_active_storage_attachments_uniqueness, unique: true


    add_column :active_storage_variant_records, :temp_id, :uuid, default: "gen_random_uuid()", null: false
    execute "ALTER TABLE active_storage_variant_records DROP CONSTRAINT active_storage_variant_records_pkey;"
    execute "ALTER TABLE active_storage_variant_records ADD PRIMARY KEY (temp_id);"
    remove_column :active_storage_variant_records, :id
    rename_column :active_storage_variant_records, :temp_id, :id

    remove_column :active_storage_variant_records, :blob_id
    add_column :active_storage_variant_records, :blob_id, :uuid, null: false
    add_foreign_key :active_storage_variant_records, :active_storage_blobs, column: :blob_id
    add_index :active_storage_variant_records, [ :blob_id, :variation_digest ], name: :index_active_storage_variant_records_uniqueness
  end
end
