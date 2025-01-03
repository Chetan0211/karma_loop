class RemoveUniquenessFromActionTextRichTexts < ActiveRecord::Migration[7.1]
  def change
    remove_index :action_text_rich_texts, name: "index_action_text_rich_texts_uniqueness"
    add_index :action_text_rich_texts, ["record_type", "record_id", "name"]
  end
end
