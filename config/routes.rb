Deglassified::Application.routes.draw do
  scope :api do
    resources :locations, only: [:index, :show, :create, :update] do
      resources :businesses, only: [:index, :show, :create, :update]
    end
  end

  root 'map#index'
end
