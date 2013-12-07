#= require jquery
#= require jquery_ujs
#= require foundation
#= require mapbox.js
#= require_tree .

$ ->
  $(document).foundation()

  map = L.mapbox.map('map', 'licyeus.gg3718oi').setView([47.603569, -122.329453], 12)
