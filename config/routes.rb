Deglassified::Application.routes.draw do
  scope :api do
    devise_for :users, controllers: { sessions: 'api/sessions', registrations: 'api/registrations' }
    resources :locations, only: [:index, :show, :create, :update] do
      resources :businesses, only: [:index, :show, :create, :update]
    end
  end

  get '*path', controller: 'map', action: 'index'

  root 'map#index'
end
