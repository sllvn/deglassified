class GeocoderController < ApplicationController
  before_filter :authenticate_user!, only: [] # kludge

  def index
    if params[:address].blank?
      render json: {}
      return
    end

    geocoded_address = Geocoder.geocode(params[:address])

    render json: geocoded_address
  end
end
