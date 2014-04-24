class Geocoder
  def self.geocode(city)
    begin
      req = Faraday.get("http://www.mapquestapi.com/geocoding/v1/address?key=#{ENV['MAPQUEST_GEOCODING_API_KEY']}&location=#{URI.escape(city)}")
      geocoded = JSON.parse(req.body)
      result = geocoded['results'].first['locations'].first
      return { status: 'ZERO_RESULTS' } unless result

      city_key = result.find { |k,v| v == 'City' }.first.gsub('Type', '')
      city = result[city_key] || ''
      state_key = result.find { |k,v| v == 'State' }.first.gsub('Type', '')
      state = result[state_key] || ''
      country_key = result.find { |k,v| v == 'Country' }.first.gsub('Type', '')
      country = result[country_key] || ''

      formatted_address = "#{result['street']}, #{city}, #{state} #{result['postalCode']}, #{country}"

      {
        status: 'OK',
        result: {
          formatted_address: formatted_address,
          city: city,
          state: state,
          coords: {
            lat: result['displayLatLng']['lat'].to_f,
            lng: result['displayLatLng']['lng'].to_f
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
