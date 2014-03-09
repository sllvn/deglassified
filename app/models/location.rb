class Location < ActiveRecord::Base
  has_many :businesses

  extend FriendlyId
  friendly_id :city, use: :slugged

  def url_slug
    city.downcase.gsub(/\s/, '-')
  end

  def self.search(search_term)
    self.where('lower(city) like ?', "%#{search_term.downcase}%")
  end

  def self.create_and_geocode(name)
    location = Location.new

    geocoded = Geocoder.geocode(name)
    return nil unless geocoded.present?

    location.lat = geocoded.lat
    location.lng = geocoded.lng
    location.city = geocoded.city
    location.state = geocoded.state

    location.save
    location
  end
end
