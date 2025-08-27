class User::Contract::UpdatePassword < ApplicationContract
  property :password
  property :password_confirmation, virtual: true
  property :reset_password_token
  property :reset_password_sent_at
  property :public_key
  property :encrypted_key
  property :last_key_reset_at

  validates :password, presence:{message: "Password can't be blank."}, format:{
    with: /\A^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$\z/i,
    message: "Password is not in a valid format."
  }

  validates :password_confirmation, presence:{message:"Confirm password can't be blank."}
  validate :confirm_password_check

  validates :public_key, presence: {message: "Internal server error"}
  validates :encrypted_key, presence: {message: "Internal server error"}

  private

  def confirm_password_check
    if password != password_confirmation
      errors.add(:password_confirmation, "Your password and confirm password should match.")
    end
  end
end
