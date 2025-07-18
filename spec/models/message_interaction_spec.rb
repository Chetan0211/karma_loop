# == Schema Information
#
# Table name: message_interactions
#
#  id         :uuid             not null, primary key
#  reaction   :string
#  read_at    :datetime
#  created_at :datetime         not null
#  updated_at :datetime         not null
#  chat_id    :uuid             not null
#  user_id    :uuid             not null
#
# Indexes
#
#  index_message_interactions_on_chat_id  (chat_id)
#  index_message_interactions_on_user_id  (user_id)
#
# Foreign Keys
#
#  fk_rails_...  (chat_id => chats.id)
#  fk_rails_...  (user_id => users.id)
#
require 'rails_helper'

RSpec.describe MessageInteraction, type: :model do
  pending "add some examples to (or delete) #{__FILE__}"
end
