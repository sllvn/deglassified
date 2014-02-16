angular.module('service.data-loader', ['restangular'])

// Find a way to run this without having to inject service in a controller
.service('dataLoader', function($rootScope, $q, Restangular) {

    var cachedLocations = {};

    $rootScope.$on('getLocationData', function(event, locationSlug) {
        // If the location is not cached, make a restangular call for it
        if (!cachedLocations[locationSlug]) {
            var getLocationData = function() {
                var deferred = $q.defer();
                Restangular.one('locations', locationSlug)
                    .get()
                    .then(function(data) {
                        deferred.resolve(data.location);
                    });
                return deferred.promise;
            };

            getLocationData()
                .then(
                function(location) {
                    // Add the newly fetched location to the cached locations
                    cachedLocations[location.slug] = location;
                    $rootScope.$emit('locationDataRetrieved', location);

                    // Now set the businesses for the location
                    $rootScope.businesses = location.businesses;
                    $rootScope.$emit('setBusinessesInMapbox', location.businesses);
                }
            );
        } else {
            $rootScope.$emit('locationDataRetrieved', cachedLocations[locationSlug]);
        }
    });


})

;