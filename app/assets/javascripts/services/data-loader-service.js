angular.module('service.data-loader', ['restangular'])

// Find a way to run this without having to inject service in a controller
.service('dataLoader', function($rootScope, $q, Restangular) {

    var cachedLocations = {};

    $rootScope.$on('getLocationData', function(event, currentLocationSlug) {
        if (!cachedLocations[currentLocationSlug]) {
            var getLocationData = function() {
                var deferred = $q.defer();
                Restangular.one('locations', currentLocationSlug)
                    .get()
                    .then(function(data) {
                        deferred.resolve(data.location);
                    });
                return deferred.promise;
            };

            getLocationData()
                .then(
                function(locationData) {
                    // Add the newly fetched location to the cached locations
                    cachedLocations[locationData.slug] = locationData;
                    $rootScope.$emit('locationDataRetrieved', locationData);
                }
            );
        } else {
            $rootScope.$emit('locationDataRetrieved', cachedLocations[currentLocationSlug]);
        }
    });

})

;