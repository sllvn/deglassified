//= require mapbox.js

angular.module('service.mapbox', ['restangular', 'ui.router'])

.service('mapboxService', function($rootScope, $state, Restangular) {
    var mapName = 'map',
        map = L.mapbox.map(mapName, 'licyeus.gg3718oi').setView([47.603569, -122.329453], 12);

    var geoJSON = {
        type: 'FeatureCollection',
        features: []
    };

    var markerLayer = L.mapbox.markerLayer();

    function loadLocation(location) {
        if (location.coordinates) {
           panTo(location.coordinates);
        }
        clearMarkers();
        $('.open').find('.close-reveal-modal').click();
        $rootScope.current_location = location;
//        loadBusinesses(location);
    }


    $rootScope.$on('businessesLoaded', function() {
        angular.forEach($rootScope.businesses, function(business) {
            addBusiness(business);
        });
        $rootScope.$emit('businessesDone');
    });

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
            business = layer.feature.properties.business;
            // Need to find the correct path for the compiled .html file
//            var content = "<div ng-include='/partials/test.html'></div>";
            var content  = "<h4>" + business.name + "</h4>" +
                "<p>" + business.address + "</p>";
            if (business.links)
                content += '<p>'
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
                    $state.go('location.business', { business: business.url_slug });
                };
            }(business));
        });
    }

    function openPopupForId(businessId) {
        markerLayer.eachLayer(function(marker) {
            if (Number(marker.feature.properties.business.id) == Number(businessId)) {
                marker.openPopup();
                panTo(marker.getLatLng());
            }
        })
    }

    function clearMarkers() {
        markerLayer.clearLayers();
        geoJSON.features.length = 0;
    }

    function panTo(coordinates) {
        map.panTo([coordinates.lat, coordinates.lng]);
    }


    return {
        loadLocation: loadLocation,
        addBusiness: addBusiness,
        openPopupForId: openPopupForId
    };
})

;