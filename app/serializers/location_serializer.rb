class LocationSerializer < ActiveModel::Serializer
  attributes :id, :city, :state, :coordinates

  def coordinates
    {
      lat: object.lat,
      lng: object.lng
    }
  end
end
