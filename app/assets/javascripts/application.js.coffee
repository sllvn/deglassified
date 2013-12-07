#= require jquery
#= require jquery_ujs
#= require foundation
#= require mapbox.js
#= require_tree .

$ ->
  $(document).foundation()

  map = new Map('map')
  $.get '/api/businesses', (data) ->
    $.each data.businesses, (index, business) ->
      add_map_to_list(business)

  # TODO: figure out where to put this
  add_map_to_list = (business) ->
    console.log "adding business #{business.name}"
    map.add_business business


class Map
  constructor: (map) ->
    @map = L.mapbox.map(map, 'licyeus.gg3718oi').setView([47.603569, -122.329453], 12)
    
    
  add_business: (business) ->
    @markerLayer = L.mapbox.markerLayer({
      type: 'Feature'
      geometry: {
        type: 'Point'
        coordinates: [business.coordinates.lng, business.coordinates.lat]
      }
      properties: {
        business: business
      }
    }).addTo(@map)

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
