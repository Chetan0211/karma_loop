require "rails_helper"

RSpec.describe Chat::Create do
  let(:user) { create(:user, public_key: "PUBLIC_KEY", encrypted_key: "ENCRYPTED_KEY") }
  let(:friend) { create(:user, public_key: "PUBLIC_KEY", encrypted_key: "ENCRYPTED_KEY") }
  let(:group) { create(:group, :group_friend) }

  before do
    create(:group_user, group: group, user: user, status: "follower")
    create(:group_user, group: group, user: friend, status: "follower")
  end

  def upload(content_type:)
    blob = ActiveStorage::Blob.create_and_upload!(io: StringIO.new("ciphertext"), filename: "#{SecureRandom.uuid}.enc", content_type: content_type)
    blob.signed_id
  end

  def call(**chat_params)
    Chat::Create.call(temp_chat_id: "temp_chat_id", chat_params: { group_id: group.id, user_id: user.id, message: "" }.merge(chat_params))
  end

  it "is valid with encrypted attachments and a manifest" do
    result = call(attachments: [upload(content_type: "application/octet-stream")], attachments_manifest: "ENCRYPTED_MANIFEST")
    expect(result).to be_success
    expect(result[:model].reload.attachments_manifest).to eq("ENCRYPTED_MANIFEST")
  end

  context "with unencrypted attachments" do
    it "is invalid without a manifest" do
      attachments = [upload(content_type: "application/octet-stream")]
      expect { expect(call(attachments: attachments)).to be_failure }.not_to change(Chat, :count)
    end

    it "is invalid with a plain file" do
      attachments = [upload(content_type: "image/png")]
      expect { expect(call(attachments: attachments, attachments_manifest: "ENCRYPTED_MANIFEST")).to be_failure }.not_to change(Chat, :count)
    end
  end
end
