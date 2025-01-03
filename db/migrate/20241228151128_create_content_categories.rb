class CreateContentCategories < ActiveRecord::Migration[7.1]
  def change
    create_table :content_categories, id: :uuid do |t|
      t.string :category, null: false
      t.timestamps
    end
    add_index :content_categories, :category, unique: true
  end
end
