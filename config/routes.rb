WithoutGlass::Application.routes.draw do
  scope :api do
    resources :businesses, only: [:index, :show]
  end

  root 'map#index'
end
