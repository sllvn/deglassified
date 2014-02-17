class SimpleLocationSerializer < ActiveModel::Serializer
  attributes :id, :city, :state, :coordinates, :slug

  def coordinates
    {
      lat: object.lat,
      lng: object.lng
    }
  end
end
