angular.module('service.location-data', ['restangular'])

// TODO: Find a way to run this without having to inject service in a controller
.service('locationDataService', function($rootScope, $q, Restangular) {
    var cachedLocations = {};

    function getSingle(locationSlug) {
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
    }

    function getList() {
        var deferred = $q.defer();
        Restangular.one('locations')
            .get()
            .then(function(data) {
                deferred.resolve(data.locations);
            });
        return deferred.promise;
    }

    return {
        getSingle: getSingle,
        getList: getList
    };

})

;