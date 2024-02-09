Rails.application.routes.draw do
  get '/', to: 'game#index'
  # Define your application routes per the DSL in https://guides.rubyonrails.org/routing.html

  # Reveal health status on /up that returns 200 if the app boots with no exceptions, otherwise 500.
  # Can be used by load balancers and uptime monitors to verify that the app is live.
  # get "up" => "rails/health#show", as: :rails_health_check

  # Defines the root path route ("/")
  # root "posts#index"

  namespace :api do
    namespace :v1 do
      post 'move', to: 'play#move'
      post 'new_game', to: 'play#new_game'
      patch 'reset_game', to: 'play#reset_game'
    end
  end
end
