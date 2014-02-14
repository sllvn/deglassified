Deglassified::Application.routes.draw do
  scope :api do
    resources :businesses, only: [:index, :show]

    resources :locations, only: [:index, :show] do
      resources :businesses, only: [:index, :show]
    end
  end

  get '*path', controller: 'map', action: 'index'

  root 'map#index'
end
