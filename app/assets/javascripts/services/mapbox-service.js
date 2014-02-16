//= require mapbox.js

angular.module('service.mapbox', ['restangular', 'ui.router'])

.service('mapboxService', function($rootScope, $state, $compile) {
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
        loadBusinesses();
    }

    // Only used for initial page load
    $rootScope.$on('businessesLoaded', function() {
        loadBusinesses();
        $rootScope.$emit('businessesDone');
    });

    function loadBusinesses() {
        angular.forEach($rootScope.businesses, function(business) {
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
            business = layer.feature.properties.business;
            var content = "<div id='business-data' ng-include='/partials/test.html'></div>";
            layer.bindPopup(content);
            $compile(angular.element('#business-data'));

//            if (!$scope.$$phase) {
////                $digest;
//            }

            layer.on('popupopen', function(business) {
                return function() {
                    // Need to add location params
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