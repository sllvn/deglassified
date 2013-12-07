class BusinessesController < ApplicationController
  def index
    render json: Business.all, each_serializer: BusinessSerializer
  end

  def show
    render json: Business.find(params[:id]), serializer: BusinessSerializer
  end
end
