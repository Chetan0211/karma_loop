# == Schema Information
#
# Table name: chats
#
#  id          :uuid             not null, primary key
#  message     :text             not null
#  created_at  :datetime         not null
#  updated_at  :datetime         not null
#  group_id    :uuid             not null
#  reply_to_id :uuid
#  user_id     :uuid             not null
#
# Indexes
#
#  index_chats_on_group_id  (group_id)
#  index_chats_on_user_id   (user_id)
#
# Foreign Keys
#
#  fk_rails_...  (group_id => groups.id)
#  fk_rails_...  (reply_to_id => chats.id)
#  fk_rails_...  (user_id => users.id)
#
require 'rails_helper'

RSpec.describe Chat, type: :model do
  pending "add some examples to (or delete) #{__FILE__}"
end
