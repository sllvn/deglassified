angular.module('service.get-location', ['restangular'])

// TODO: Find a way to run this without having to inject service in a controller
.service('getLocationService', function($rootScope, $q, Restangular) {
    var cachedLocations = {};

    return function (locationSlug) {
        var deferred = $q.defer();
        // If the location is not cached, make a restangular call for it
        if (!cachedLocations[locationSlug]) {
            Restangular.one('locations', locationSlug)
                .get()
                .then(function(data) {
                    var location = data.location;
                    cachedLocations[location.slug] = location;
                    deferred.resolve(location);
                });
        } else {
            var location = cachedLocations[locationSlug];
            deferred.resolve(location);
        }
        return deferred.promise;
    };

})

;