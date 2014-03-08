class Location < ActiveRecord::Base
  has_many :businesses

  extend FriendlyId
  friendly_id :city, use: :slugged

  def url_slug
    city.downcase.gsub(/\s/, '-')
  end

  def self.create_and_geocode(name)
    location = Location.new
    location.city = name
    location.lat, location.lng = Geocoder.geocode(name)
    location.save
    location
  end
end
