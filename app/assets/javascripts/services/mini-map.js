//= require mapbox.js

angular.module('service.mini-map', [])

.service('miniMapService', function($rootScope) {
    var map,
        marker;

    function initMap(coords) {
        var mapElement = 'minimap',
            defaultView = [coords.lat, coords.lng],
            defaultZoom = 15;
        map = L.mapbox.map(mapElement, 'licyeus.gg3718oi').setView(defaultView, defaultZoom);
    }

    function showBusiness(coords, business) {
        if (marker) {
            clearMarker();
        }
        createNewMarker(coords, business);
        marker.openPopup();
    }

    function clearMarker() {
        map.removeLayer(marker);
    }

    function createNewMarker(coords, business) {
        marker = L.marker([coords.lat, coords.lng], { draggable:true })
            .addTo(map);
        bindMarkerPopup(business);
        marker.on('dragend', handleMarkerDrag);
    }

    function bindMarkerPopup(business) {
        var content  = "<h4>" + business.name + "</h4>" +
            "<p>" + business.address + "</p>";
        if (business.links) {
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
        }
        marker.bindPopup(content);
    }

    function handleMarkerDrag(event) {
        var coords = event.target.getLatLng();
        $rootScope.$broadcast('locationCoordsChange', coords);
        marker.openPopup();
        panMapTo(coords);
    }
    
    function panMapTo(coords) {
        map.panTo([coords.lat, coords.lng]);
    }

    return {
        initMap: initMap,
        showBusiness: showBusiness
    };
})

;
