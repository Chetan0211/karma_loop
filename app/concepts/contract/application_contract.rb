# Application level contract for including important bits.
require 'reform/form/coercion'
require 'dry-types'

module Types
  include Dry.Types()
end

class ApplicationContract < Reform::Form
  feature Coercion
  def persisted?
    model.persisted?
  end
end