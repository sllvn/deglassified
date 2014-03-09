class Geocoder
  def self.geocode(city)
    begin
      response = open("https://maps.googleapis.com/maps/api/geocode/json?key=#{ENV['GOOGLE_GEOCODING_API_KEY']}&sensor=false&address=#{URI.escape(city)}")
      geocoded = JSON.parse(response.string)
      result = geocoded['results'].first
      {
        formatted_city: result['address_components'][0]['short_name'],
        formatted_state: result['address_components'][2]['short_name'],
        lat: result['geometry']['location']['lat'].to_f,
        lng: result['geometry']['location']['lng'].to_f
      }
    rescue
      nil
      # TODO: log GeocodingException.new("Error geocoding #{city}")
    end
  end
end

class GeocodingException < Exception; end
