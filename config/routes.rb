Rails.application.routes.draw do
  # Define your application routes per the DSL in https://guides.rubyonrails.org/routing.html

  # Defines the root path route ("/")
  root "zoom_breakouts#home"
    # Zoom Breakout Manager routes
  get 'zoom_breakouts/auth', to: 'zoom_breakouts#auth'
  get 'zoom_breakouts/install', to: 'zoom_breakouts#install'
  get 'zoom_breakouts/home', to: 'zoom_breakouts#home'
end
