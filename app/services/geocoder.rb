class Geocoder
  def self.geocode(city)
    response = open("http://api.geocod.io/v1/geocode?api_key=#{ENV['GEOCODIO_API_KEY']}&q=#{URI.escape(city)}")
    geocoded = JSON.parse(response.string)
    raise GeocodingException.new("Error geocoding #{city}") unless geocoded['results'].length > 0
    [
      geocoded['results'].first['location']['lat'].to_f,
      geocoded['results'].first['location']['lng'].to_f
    ]
  end
end

class GeocodingException < Exception; end
