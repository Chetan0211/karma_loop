require 'sidekiq/web'

Rails.application.routes.draw do
  devise_for :users, controllers:{registrations: 'users/registrations', sessions: 'users/sessions'}
  mount Sidekiq::Web => '/sidekiq'
  # Define your application routes per the DSL in https://guides.rubyonrails.org/routing.html

  # Reveal health status on /up that returns 200 if the app boots with no exceptions, otherwise 500.
  # Can be used by load balancers and uptime monitors to verify that the app is live.
  get "up" => "rails/health#show", as: :rails_health_check

  # user routes
  get "profile/:id" => "user#profile", as: :user_profile
  post "update_profile_picture/:id" => "user#update_profile_picture", as: :update_profile_picture
  patch "update_profile/:id" => "user#update_profile", as: :update_profile
  delete "remove_profile_picture/:id" => "user#remove_profile_picture", as: :remove_profile_picture
  patch "update_password/:id" => "user#update_password", as: :update_password

  # background jobs
  get "video_transcode" => "background#video_transcode", as: :video_transcode

  #search routes
  get "autocomplete" => "search#autocomplete", as: :autocomplete
  get "search_user_community" => "search#search_user_community", as: :search_user_community
  
  resources :admin, only: [:index]

  # post routes
  resources :post, only: [:new, :create, :show] do
    post "comment" => "post#comment", as: :add_comment
    get "post_reaction" => "post#post_reaction", as: :post_reaction
    get "comment_reaction" => "post#comment_reaction", as: :comment_reaction
  end

  # friend routes
  get "friend_request/:id" => "friends#friend_request", as: :friend_request
  get "remove_friend/:id" => "friends#remove_friend_request", as: :remove_friend

  #settings routes
  get "site_settings" => "settings#site_settings", as: :site_settings
  resources :search, only: [:index]

  # Defines the root path route ("/")
  root "home#index"
end
