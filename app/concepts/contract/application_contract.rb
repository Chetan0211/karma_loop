# Application level contract for including important bits.
require 'reform/form/coercion'
class ApplicationContract < Reform::Form
  feature Coercion
  def persisted?
    model.persisted?
  end
end