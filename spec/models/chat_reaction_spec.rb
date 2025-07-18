# == Schema Information
#
# Table name: chat_reactions
#
#  id         :uuid             not null, primary key
#  reaction   :string
#  created_at :datetime         not null
#  updated_at :datetime         not null
#  chat_id    :uuid             not null
#  user_id    :uuid             not null
#
# Indexes
#
#  index_chat_reactions_on_chat_id   (chat_id)
#  index_chat_reactions_on_reaction  (reaction)
#  index_chat_reactions_on_user_id   (user_id)
#
# Foreign Keys
#
#  fk_rails_...  (chat_id => chats.id)
#  fk_rails_...  (user_id => users.id)
#
require 'rails_helper'

RSpec.describe ChatReaction, type: :model do
  pending "add some examples to (or delete) #{__FILE__}"
end
