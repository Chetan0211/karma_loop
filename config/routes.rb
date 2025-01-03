Rails.application.routes.draw do
  devise_for :users, controllers:{registrations: 'users/registrations'}
  # Define your application routes per the DSL in https://guides.rubyonrails.org/routing.html

  # Reveal health status on /up that returns 200 if the app boots with no exceptions, otherwise 500.
  # Can be used by load balancers and uptime monitors to verify that the app is live.
  get "up" => "rails/health#show", as: :rails_health_check

  get "profile/:id" => "user#profile", as: :user_profile

  post "update_profile_picture/:id" => "user#update_profile_picture", as: :update_profile_picture
  delete "remove_profile_picture/:id" => "user#remove_profile_picture", as: :remove_profile_picture
  patch "update_password/:id" => "user#update_password", as: :update_password

  resources :post, only: [:new, :create, :show] do
    post "comment" => "post#comment", as: :add_comment

  end
  
  scope :profile do
    resources :posts
  end

  # Defines the root path route ("/")
  root "home#index"
end
