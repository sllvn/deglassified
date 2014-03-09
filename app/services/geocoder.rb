class Geocoder
  def self.geocode(city)
    begin
      req = Faraday.get("https://maps.googleapis.com/maps/api/geocode/json?key=#{ENV['GOOGLE_GEOCODING_API_KEY']}&sensor=false&address=#{URI.escape(city)}")
      geocoded = JSON.parse(req.body)
      result = geocoded['results'].first
      return { status: 'ZERO_RESULTS' } unless result
      {
        status: 'OK',
        result: {
          formatted_address: result['formatted_address'],
          city: result['address_components'].find { |ac| ac['types'].find { |t| t == 'locality' } }['long_name'],
          state: result['address_components'].find { |ac| ac['types'].find { |t| t == 'administrative_area_level_1' } }['short_name'],
          coords: {
            lat: result['geometry']['location']['lat'].to_f,
            lng: result['geometry']['location']['lng'].to_f
          }
        }
      }
    rescue
      nil
      # TODO: log GeocodingException.new("Error geocoding #{city}")
    end
  end
end

class GeocodingException < Exception; end
