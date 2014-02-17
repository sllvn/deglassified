//= require mapbox.js

angular.module('service.mapbox', ['restangular', 'ui.router'])

.service('mapboxService', function($rootScope, $state) {
    var mapName = 'map',
        defaultView = [47.603569, -122.329453],
        defaultZoom = 12,
        map = L.mapbox.map(mapName, 'licyeus.gg3718oi').setView(defaultView, defaultZoom);

    var geoJSON = {
        type: 'FeatureCollection',
        features: []
    };

    var markerLayer = L.mapbox.markerLayer();


    $rootScope.$on('locationDataRetrieved', function(event, location) {
        loadLocationOnMapbox(location);
    });

    function loadLocationOnMapbox(location) {
        if (location.coordinates) {
            panTo(location.coordinates);
        }
        clearMarkers();
        $('.open').find('.close-reveal-modal').click();
    }

    $rootScope.$on('setBusinessesInMapbox', function(event, businesses) {
        addBusinessesToMapbox(businesses);
        // Changin this broadcast to emit to nested scopes
        $rootScope.$broadcast('businessesLoadedInMapbox');
        // Need to set this flag so that we know it is safe to open a business's popup
        $rootScope.businessesLoadedInMapbox = true;
    });

    function addBusinessesToMapbox() {
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
            setPopups(layer);
        });
    }

    function setPopups(layer) {
        business = layer.feature.properties.business;

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

        layer.setPopupContent(content);

        layer.on('popupopen', function(business) {
            return function() {
                console.log('open');
                $state.go('location.business', { business: business.slug });
            };
        }(business));

        layer.on('popupclose', function() {
            console.log('close');
            var location = $rootScope.currentLocation;
            // Not doing a full reload of the location controller, which would recenter the user.
            // Just changing the url and page title.
            $rootScope.pageTitle = location.city;
            $state.go('location', { location: location.slug });
        });
    }


    $rootScope.$on('openPopupForBusiness', function(event, businessId) {
        openPopupForId(businessId);
    });

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

})

;