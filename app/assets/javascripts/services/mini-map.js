//= require mapbox.js

angular.module('service.mini-map', [])

.service('miniMapService', function($rootScope) {
    var map,
        marker;

    function showBusiness(business) {
        if (document.getElementById('minimap')) {
            initMap(business.coords);
            createNewMarker(business);
        }
    }

    function initMap(coords) {
        var mapElement = 'minimap',
            defaultView = [coords.lat, coords.lng],
            defaultZoom = 15;
        map = L.mapbox.map(mapElement, 'licyeus.gg3718oi').setView(defaultView, defaultZoom);
    }

    function createNewMarker(business) {
        //clearMarker();
        marker = L.marker([business.coords.lat, business.coords.lng], { draggable:true })
            .addTo(map);
        bindMarkerPopup(business);
        marker.on('dragend', handleMarkerDrag);
        marker.openPopup();
    }

    function bindMarkerPopup(business) {
        var content  = "<h4>" + business.name + "</h4>" +
            "<p>" + business.address + "</p>";
        if (business) {
            content += '<p>';
            if (business.website)
                content += "<a href='" + business.website + "' target='_blank'><i class='fi-link'></i> website</a><br>";
            if (business.facebook)
                content += "<a href='" + business.facebook + "' target='_blank'><i class='fi-social-facebook'></i> facebook</a><br>";
            if (business.twitter)
                content += "<a href='" + business.twitter + "' target='_blank'><i class='fi-social-twitter'></i> twitter</a><br>";
            if (business.yelp)
                content += "<a href='" + business.yelp + "' target='_blank'><i class='fi-social-yelp'></i> yelp</a><br>";
            content += '</p>';
        }
        marker.bindPopup(content);
    }

    function clearMarker() {
        if (marker) {
            map.removeLayer(marker);
        }
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
        showBusiness: showBusiness,
        createNewMarker: createNewMarker 
    };
})

;
