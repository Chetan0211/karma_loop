class ChangeIdFormatInActionTextsRichTexts < ActiveRecord::Migration[7.1]
  def change
    add_column :action_text_rich_texts, :uuid_temp, :uuid, default: "gen_random_uuid()", null: false
    execute "ALTER TABLE action_text_rich_texts DROP CONSTRAINT action_text_rich_texts_pkey;"
    execute "ALTER TABLE action_text_rich_texts ADD PRIMARY KEY (uuid_temp);"

    remove_column :action_text_rich_texts, :id
    rename_column :action_text_rich_texts, :uuid_temp, :id
  end
end
