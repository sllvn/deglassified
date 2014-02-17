class LocationSerializer < ActiveModel::Serializer

  attributes :id, :city, :state, :coordinates, :slug
  has_many :businesses

  def coordinates
    {
      lat: object.lat,
      lng: object.lng
    }
  end
end
