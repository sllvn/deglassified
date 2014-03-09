class BusinessesController < ApplicationController
  before_filter :authenticate_user!, only: [:create, :update]

  def index
    if params[:location_id]
      @businesses = Location.friendly.find(params[:location_id]).businesses
    elsif params[:lat] and params[:lng]
      radius = params[:radius] || 1000
      origin = [params[:lat].to_f, params[:lng].to_f]
      @businesses = Business.within(radius.to_f/1000, origin: origin).by_distance(origin: origin)
    else
      @businesses = Business.all
    end

    render json: @businesses, each_serializer: BusinessSerializer
  end

  def show
    render json: Business.friendly.find(params[:id]), serializer: BusinessSerializer
  end

  def create
    if Business.find_by(name: business_params[:name], address: business_params[:address])
      render json: { status: 'failure', errors: ['That business already exists'] }, status: :unprocessable_entity
      return
    end

    @business = Business.new(business_params)
    location = Location.find_by(city: params[:business][:location]) || Location.create_and_geocode(params[:business][:location])
    @business.location = location

    if @business.location.present? and @business.save
      render json: @business.attributes.merge({ location: @business.location }), status: :created, business: @business
    else
      error_messages = @business.errors.messages.map { |k,v| "#{k} #{v.join(' and ')}" }
      error_messages << 'There was a problem geocoding the location.' unless @business.location.present?
      error_response = { status: 'failure', errors: error_messages }
      render json: error_response, status: :unprocessable_entity
    end
  end

  def update
    @business = Business.friendly.find(params[:id])

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
