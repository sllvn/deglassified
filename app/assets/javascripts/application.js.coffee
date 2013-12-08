#= require jquery
#= require jquery_ujs
#= require foundation
#= require mapbox.js
#= require_tree .

$ ->
  $(document).foundation()

  map = new Map('map')
  business_store = new BusinessStore($('#business-listing tbody'), map)

  $.get '/api/businesses', (data) ->
    business_store.clear_all()
    $.each data.businesses, (index, business) ->
      business_store.add_business(business)

class BusinessStore
  # TODO: fix all this
  constructor: (@listing, @map) ->
    @clear_all()

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

  clear_markers: ->
    # TODO: remove markers from map
    
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

  open_popup_for_id: (business_id) ->
    @markerLayer.eachLayer (marker) ->
      marker.openPopup() if Number(marker.feature.properties.business.id) == Number(business_id)
