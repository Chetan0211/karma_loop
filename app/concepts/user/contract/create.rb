class User::Contract::Create < ApplicationContract
  property :username
  property :password
  property :password_confirmation, virtual: true
  property :email
  property :dob
  property :encrypted_key
  property :public_key

  validates :username, presence:{message: "Username can't be blank."}, format:{
    with: /\A\w+\z/,
    message: "Username is not in the given format."
  }
  validate :username_uniqueness

  validates :email, presence:{message: "Email can't be blank."}, format:{
    with: /\A[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}\z/,
    message: "Email is not in a valid format."
  }
  validate :email_uniqueness
  
  validates :password, presence:{message: "Password can't be blank."}, format:{
    with: /\A^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$\z/i,
    message: "Password is not in a valid format."
  }

  validates :password_confirmation, presence:{message:"Confirm password can't be blank."}
  validate :confirm_password_check

  validates :dob, presence:{message: "Date of birth can't be blank."}

  validates :public_key, presence: {message: "Internal server error"}
  validates :encrypted_key, presence: {message: "Internal server error"}

  private

  def username_uniqueness
    if User.find_by(username: username).present?
      errors.add(:username, "This username is already taken.")
    end
  end

  def email_uniqueness
    if User.find_by(email: email).present?
      errors.add(:email, "We already have an account with this email.")
    end
  end

  def confirm_password_check
    if password != password_confirmation
      errors.add(:password_confirmation, "Your password and confirm password should match.")
    end
  end
end