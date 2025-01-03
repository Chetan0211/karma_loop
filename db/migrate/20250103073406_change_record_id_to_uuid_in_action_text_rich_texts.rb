class ChangeRecordIdToUuidInActionTextRichTexts < ActiveRecord::Migration[7.1]
  def up
    # Add a temporary UUID column
    add_column :action_text_rich_texts, :record_id_temp, :uuid
  
    # Convert existing BIGINT values to UUID strings (example: padded UUIDs)
    execute <<-SQL
      UPDATE action_text_rich_texts
      SET record_id_temp = gen_random_uuid();
    SQL
  
    # Remove the old column and rename the new one
    remove_column :action_text_rich_texts, :record_id
    rename_column :action_text_rich_texts, :record_id_temp, :record_id
  end
  
  def down
    add_column :action_text_rich_texts, :record_id_temp, :bigint
    execute <<-SQL
      UPDATE action_text_rich_texts
      SET record_id_temp = CAST(SUBSTRING(record_id::text, 1, 8) AS BIGINT);
    SQL
    remove_column :action_text_rich_texts, :record_id
    rename_column :action_text_rich_texts, :record_id_temp, :record_id
  end
end
