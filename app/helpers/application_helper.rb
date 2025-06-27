module ApplicationHelper
  def number_to_k(number)
    number_to_human(number, units: { thousand: 'K', million: 'M', billion: 'B', trillion: 'T' }, format: '%n%u')
  end
end
