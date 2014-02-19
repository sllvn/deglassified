//= require mapbox.js

angular.module('service.mapbox', [ 'ui.router'])

.service('mapboxService', function($rootScope, $state) {
    var mapName = 'map',
        defaultView = [47.603569, -122.329453],
        defaultZoom = 12,
        map = L.mapbox.map(mapName, 'licyeus.gg3718oi').setView(defaultView, defaultZoom);

    var geoJSON = {
        type: 'FeatureCollection',
        features: []
    };

    var markerLayer;

    function loadLocation(location) {
        markerLayer = L.mapbox.markerLayer();
        clearMarkers();
        if (location.coordinates) {
            panTo(location.coordinates);
        }
        addBusinessesToMapbox(location.businesses);
    }

    function addBusinessesToMapbox(businesses) {
        angular.forEach(businesses, function(business) {
            addBusiness(business);
        });
    }

    function addBusiness(business) {
        geoJSON.features.push({
            type: 'Feature',
            geometry: {
                type: 'Point',
                coordinates: [business.coordinates.lng, business.coordinates.lat]
            },
            properties: {
                business: business
            }
        });
        markerLayer.setGeoJSON(geoJSON);
        markerLayer.addTo(map);
        markerLayer.eachLayer(function(layer) {
            setPopups(layer);
        });
    }

    function setPopups(layer) {
        var business = layer.feature.properties.business;

        // Not worth binding an ng-include to the pop-up instead, as you'll have to $compile the ng-include div
        // AND and nested directives inside the ng-included template.
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

        layer.bindPopup(content);

        layer.on('popupopen', function(business) {
            return function() {
                $state.go('location.business', { business: business.slug });
            };
        }(business));

        map.on('popupclose', function() {
            // Potentially add a flag instead like if (!changingLocations)
            console.log('closed');
            $rootScope.pageTitle = $rootScope.currentLocation.city;
            // Does not 'reload' the state controller; Just changes the window location href
            $state.go('location', { location: $rootScope.currentLocation.slug });
        });
    }

    function openBusinessPopup(businessSlug) {
        markerLayer.eachLayer(function(marker) {
            if (marker.feature.properties.business.slug === businessSlug) {
                marker.openPopup();
                panTo(marker.getLatLng());
            }
        })
    }

    function clearMarkers() {
        // Here we would set the changingLocations flag
        markerLayer.clearLayers();
        geoJSON.features.length = 0;
    }

    function panTo(coordinates) {
        map.panTo([coordinates.lat, coordinates.lng]);
    }

    return {
        clearMarkers: clearMarkers,
        loadLocation: loadLocation,
        addBusinessesToMapbox: addBusinessesToMapbox,
        openBusinessPopup: openBusinessPopup
    }

})

;