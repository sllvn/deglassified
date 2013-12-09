WithoutGlass::Application.routes.draw do
  scope :api do
    resources :businesses, only: [:index, :show]

    resources :locations, only: [:index, :show] do
      resources :businesses, only: [:index, :show]
    end
  end

  root 'map#index'
end
