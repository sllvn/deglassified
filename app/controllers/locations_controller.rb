class LocationsController < ApplicationController
  def index
    render json: Location.all, each_serializer: LocationSerializer
  end

  def show
    render json: Location.find(params[:id]), serializer: LocationSerializer
  end
end
