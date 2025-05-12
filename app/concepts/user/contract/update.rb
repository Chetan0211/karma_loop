class User::Contract::Update < ApplicationContract
  property :display_name
  property :bio
  
  validates :display_name, presence:{message: "Display name can't be blank."},
  length: {maximum: 30, message: "Display name can't be more than 30 characters."}
end