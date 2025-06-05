# == Schema Information
#
# Table name: groups
#
#  id          :uuid             not null, primary key
#  description :string
#  name        :string
#  type        :string
#  created_at  :datetime         not null
#  updated_at  :datetime         not null
#  admin_id    :uuid
#
# Indexes
#
#  index_groups_on_admin_id  (admin_id)
#  index_groups_on_type      (type)
#
# Foreign Keys
#
#  fk_rails_...  (admin_id => users.id)
#
require 'rails_helper'

RSpec.describe Group, type: :model do
  pending "add some examples to (or delete) #{__FILE__}"
end
