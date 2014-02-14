class LocationSerializer < ActiveModel::Serializer
  attributes :id, :city, :state, :coordinates, :url_slug

  def coordinates
    {
      lat: object.lat,
      lng: object.lng
    }
  end
end
