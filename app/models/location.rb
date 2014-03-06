class Location < ActiveRecord::Base
  extend FriendlyId
  friendly_id :city, use: :slugged

  has_many :businesses

  def url_slug
    city.downcase.gsub(/\s/, '-')
  end

  def self.create_and_geocode(name)
    location = Location.new
    location.name = name
    location.lat, location.lng = Geocoder.geocode(name)
    location.save
  end
end
