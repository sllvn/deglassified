Deglassified::Application.routes.draw do
  scope :api do
    resources :locations, only: [:index, :show, :create, :update] do
      resources :businesses, only: [:index, :show, :create, :update]
    end
  end

  get '*path', controller: 'map', action: 'index'

  root 'map#index'
end
