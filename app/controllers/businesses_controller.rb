class BusinessesController < ApplicationController
  def index
    if params[:location_id]
      @businesses = Location.find(params[:location_id]).businesses
    else
      @businesses = Business.all
    end

    render json: @businesses, each_serializer: BusinessSerializer
  end

  def show
    render json: Business.find(params[:id]), serializer: BusinessSerializer
  end
end
