#= require jquery
#= require jquery_ujs
#= require foundation
#= require mapbox.js
#= require angular
#= require underscore
#= require restangular.min
#= require_tree .

$ ->
  $(document).foundation()

deglassified = angular.module 'deglassified', ['restangular']
deglassified.config (RestangularProvider) -> RestangularProvider.setBaseUrl('/api')

deglassified.service 'map_service',
  class MapService
    construct: (map) ->
      @map = L.mapbox.map(map, 'licyeus.gg3718oi').setView([47.603569, -122.329453], 12)
      @geoJSON = {
        type: 'FeatureCollection',
        features: []
      }
      @markerLayer = L.mapbox.markerLayer()

    clear_markers: ->
      @markerLayer.clearLayers()
      @geoJSON.features = []
      
    pan_to: (coordinates) ->
      @map.panTo([coordinates.lat, coordinates.lng])

    add_business: (business) ->
      @geoJSON.features.push({
        type: 'Feature'
        geometry: {
          type: 'Point'
          coordinates: [business.coordinates.lng, business.coordinates.lat]
        }
        properties: {
          business: business
        }
      })
      @markerLayer.setGeoJSON(@geoJSON)
      @markerLayer.addTo(@map)

      @markerLayer.eachLayer (layer) ->
        business = layer.feature.properties.business
        content = "<h4>#{business.name}</h4>" +
          "<p>#{business.address}</p>"
        if business.links
          content += '<p>'
          if business.links.website
            content += "<a href='#{business.links.website}' target='_blank'><i class='fi-link'></i> website</a><br>"
          if business.links.facebook
            content += "<a href='#{business.links.facebook}' target='_blank'><i class='fi-social-facebook'></i> facebook</a><br>"
          if business.links.twitter
            content += "<a href='#{business.links.twitter}' target='_blank'><i class='fi-social-twitter'></i> twitter</a><br>"
          if business.links.yelp
            content += "<a href='#{business.links.yelp}' target='_blank'><i class='fi-social-yelp'></i> yelp</a><br>"
          content += '</p>'
        layer.bindPopup(content)

    open_popup_for_id: (business_id) ->
      @markerLayer.eachLayer (marker) =>
        if Number(marker.feature.properties.business.id) == Number(business_id)
          marker.openPopup()
          @pan_to(marker.getLatLng())

class DeglassifiedCtrl
  constructor: (@$scope, @Restangular, @map_service) ->
    @map_service.construct('map')

    # TODO: move resources into services
    @Restangular.all('locations').getList().then (data) =>
      @$scope.locations = data.locations
      @$scope.current_location = @$scope.locations[0]
      @$scope.current_city = @$scope.current_location.city
      @load_businesses(@$scope.locations[0])

  load_businesses: (location) ->
    @Restangular.one('locations', location.id).all('businesses').getList().then (data) =>
      @$scope.businesses = data.businesses
      angular.forEach @$scope.businesses, (business) =>
        @map_service.add_business(business)

  load_location: (location) ->
    @map_service.pan_to(location.coordinates) if location.coordinates
    @map_service.clear_markers()
    $('.open').find('.close-reveal-modal').click()
    @$scope.current_location = location
    @load_businesses(location)

  show_business: (business) ->
    @map_service.open_popup_for_id(business.id)

deglassified.controller 'DeglassifiedCtrl', ['$scope', 'Restangular', 'map_service', DeglassifiedCtrl]

root = exports ? this
root.deglassified = deglassified
