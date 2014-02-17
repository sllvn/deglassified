angular.module('service.load-location-data', ['restangular'])

// TODO: Find a way to run this without having to inject service in a controller
.service('loadLocationData', function($rootScope, $q, Restangular) {
    var cachedLocations = {};

    $rootScope.$on('getLocationData', function(event, locationSlug) {
        // If the location is not cached, make a restangular call for it
        if (!cachedLocations[locationSlug]) {
            Restangular.one('locations', locationSlug)
                .get()
                .then(function(data) {
                    var location = data.location;
                    cachedLocations[location.slug] = location;
                    emitLocationEvents(location);
                });
        } else {
            var location = cachedLocations[locationSlug];
            emitLocationEvents(location);
        }
    });

    function emitLocationEvents(location) {
        $rootScope.$emit('locationDataRetrieved', location);
        // Now set the businesses for the location
        $rootScope.businesses = location.businesses;
        $rootScope.$emit('setBusinessesInMapbox', location.businesses);
    }

})

;