class AddAttachmentsManifestToChats < ActiveRecord::Migration[7.1]
  def change
    # PGP-encrypted JSON describing each encrypted attachment (original name, type, size, AES key, IV)
    add_column :chats, :attachments_manifest, :text
  end
end
