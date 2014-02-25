//= require mapbox.js

angular.module('service.mini-map', [])

.service('miniMapService', function() {
    var mapElement = 'minimap',
        defaultView = [47.603569, -122.329453],
        defaultZoom = 12,
        map = L.mapbox.map(mapElement, 'licyeus.gg3718oi').setView(defaultView, defaultZoom);

    var geoJSON = {
        type: 'FeatureCollection',
        features: []
    };

    var markerLayer = L.mapbox.markerLayer();

    var marker;

    function showBusiness(coords, business) {
        console.log(coords); 
        if (coords) {
            panTo(coords);
        }
        marker = L.marker([coords.lat, coords.lng], { draggable:true }).addTo(map);
        bindMarkerPopup(marker, business);
        marker.on('dragend', handleMarkerDrag);
    }

    function bindMarkerPopup(marker, business) {
        var content  = "<h4>" + business.name + "</h4>" +
            "<p>" + business.address + "</p>";
        if (business.links)
            content += '<p>';
        if (business.links.website)
            content += "<a href='" + business.links.website + "' target='_blank'><i class='fi-link'></i> website</a><br>";
        if (business.links.facebook)
            content += "<a href='" + business.links.facebook + "' target='_blank'><i class='fi-social-facebook'></i> facebook</a><br>";
        if (business.links.twitter)
            content += "<a href='" + business.links.twitter + "' target='_blank'><i class='fi-social-twitter'></i> twitter</a><br>";
        if (business.links.yelp)
            content += "<a href='" + business.links.yelp + "' target='_blank'><i class='fi-social-yelp'></i> yelp</a><br>";
        content += '</p>';

        marker.bindPopup(content);
    }

    function handleMarkerDrag(event) {
        var latlng = event.target.getLatLng();
        console.log(latlng);
    }

    function panTo(coords) {
        map.panTo([coords.lat, coords.lng]);
    }

    return {
        showBusiness: showBusiness
    };
})

;
