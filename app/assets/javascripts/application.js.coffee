#= require jquery
#= require jquery_ujs
#= require foundation
#= require mapbox.js
#= require_tree .

$ ->
  $(document).foundation()

  map = new Map('map')
  map.add_business({
    name: 'Lost Lake Cafe'
    description: '1505 10th Ave, Seattle, WA'
    coordinates: {
      lat: 47.614282
      lng: -122.319453
    }
    links: {
      website: ''
      facebook: ''
      yelp: ''
      twitter: ''
    }
  })

class Map
  constructor: (map) ->
    @map = L.mapbox.map(map, 'licyeus.gg3718oi').setView([47.603569, -122.329453], 12)
    
  add_business: (business) ->
    L.mapbox.markerLayer({
      type: 'Feature'
      geometry: {
        type: 'Point'
        coordinates: [business.coordinates.lng, business.coordinates.lat]
      }
      properties: {
        title: business.name
        description: business.description
      }
    }).addTo(@map)

