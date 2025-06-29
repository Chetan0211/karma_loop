# frozen_string_literal: true

class Ability
  include CanCan::Ability

  def initialize(user)
    [
      Ability::User,
      Ability::Post
    ].each do |ability_class|
      merge(ability_class.new(user))
    end
  end
end
