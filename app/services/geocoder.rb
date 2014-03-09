class Geocoder
  def self.geocode(city)
    begin
      response = open("http://api.geocod.io/v1/geocode?api_key=#{ENV['GEOCODIO_API_KEY']}&q=#{URI.escape(city)}")
      geocoded = JSON.parse(response.string)
      result = geocoded['results'].first
      {
        formatted_city: result['address_components']['city'],
        formatted_state: result['address_components']['state'],
        lat: result['location']['lat'].to_f,
        lng: result['location']['lng'].to_f
      }
    rescue
      nil
      # TODO: log GeocodingException.new("Error geocoding #{city}")
    end
  end
end

class GeocodingException < Exception; end
