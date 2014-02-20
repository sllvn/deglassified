class LocationsController < ApplicationController
  before_filter :authenticate_user!, only: [:create, :update]

  def index
    render json: Location.all, each_serializer: SimpleLocationSerializer
  end

  def show
    render json: Location.friendly.find(params[:id]), serializer: LocationSerializer
  end

  def create
    @location = Location.new(location_params)

    if @location.save
      render json: @location, status: :created, location: @location
    else
      render json: @location.errors, status: :unprocessable_entity
    end
  end

  def update
    @location = Location.friendly.find(params[:id])

    if @location.update(location_params)
      head :no_content
    else
      render json: @location.errors, status: :unprocessable_entity
    end
  end

  private

  def location_params
    params.require(:location).permit(:city, :state, :lat, :lng)
  end
end
