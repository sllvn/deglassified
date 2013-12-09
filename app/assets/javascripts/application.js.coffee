#= require jquery
#= require jquery_ujs
#= require foundation
#= require mapbox.js
#= require_tree .

$ ->
  $(document).foundation()

  map = new Map('map')
  business_store = new BusinessStore($('#business-listing tbody'), map)
  location_store = new LocationStore($('#location-listing'), business_store, map)

  location_store.load_location(1)

  $(document).on 'open', '[data-reveal]', ->
    if $(this).attr('id') == 'change-location-modal' and location_store.locations.length == 0
      location_store.load_locations()

class LocationStore
  constructor: (@listing, @business_store, @map) ->
    @locations = []

  clear_locations: ->
    @locations = []
    @listing.empty()

  load_locations: ->
    $.get '/api/locations', (data) =>
      @clear_locations()
      $.each data.locations, (index, location) =>
        @add_location(location)

  add_location: (location) ->
    @locations.push(location)
    $location = $("<li><a data-location-id='#{location.id}'>#{location.city}, #{location.state}</a></li>")
    $location.find('a').on 'click', =>
      $link = $location.find('a')

      location_id = $link.attr('data-location-id')
        
      @business_store.clear_all()
      @load_location(location_id)
      # TODO: close modal
      $location.closest('.open').find('.close-reveal-modal').click()

    @listing.append($location)

  load_location: (location_id) ->
    # TODO: get city name
    #$.get '/api/locations', { location_id: location_id }
    current_location = {}
    for location in @locations
      current_location = location if Number(location.id) == Number(location_id)
    @map.pan_to(current_location.coordinates) if current_location.coordinates
    $('#current-city').html(current_location.city)
    $.get '/api/businesses', { location_id: location_id }, (data) =>
      @business_store.clear_all()
      $.each data.businesses, (index, business) =>
        @business_store.add_business(business)

class BusinessStore
  # TODO: fix all this
  constructor: (@listing, @map) ->

  clear_all: ->
    @businesses = []
    @listing.empty()
    @map.clear_markers()

  add_business: (business) ->
    # TODO: clean this up, use a framework with data binding (ember most likely, since we're already going jquery)
    @businesses.push(business)

    $link = $("<tr><td><a data-business-id='#{business.id}'>#{business.name}</a></td></tr>")
    # this is getting gross
    map = @map
    $link.find('a').on 'click', ->
      business_id = $(this).attr('data-business-id')
      map.open_popup_for_id(business_id)
    @listing.append($link)

    @map.add_business(business)

class Map
  constructor: (map) ->
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
