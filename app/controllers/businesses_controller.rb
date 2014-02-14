class BusinessesController < ApplicationController
  skip_before_filter :verify_authenticity_token

  def index
    @businesses = Location.find(params[:location_id]).businesses

    render json: @businesses, each_serializer: BusinessSerializer
  end

  def show
    render json: Business.find(params[:id]), serializer: BusinessSerializer
  end

  def create
    @location = Location.find(params[:location_id])
    @business = Business.new(business_params)
    @business.location = @location

    if @business.save
      render json: @business, status: :created, business: @business
    else
      render json: @business.errors, status: :unprocessable_entity
    end
  end

  def update
    @business = Business.find(params[:id])

    if @business.update(business_params)
      head :no_content
    else
      render json: @business.errors, status: :unprocessable_entity
    end
  end

  private

  def business_params
    params.require(:business).permit(:name, :address, :lat, :lng, :website, :facebook, :twitter, :yelp)
  end
end
