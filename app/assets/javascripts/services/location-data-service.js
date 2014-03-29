angular.module('service.location-data', [])

// TODO: Find a way to run this without having to inject service in a controller
.service('locationDataService', function($rootScope, $q, $http) {
    var apiUrl = '/api/locations/';
    var cachedLocations = {};

    function getSingle(locationSlug) {
        var deferred = $q.defer();

        // If the location is not cached, make a restangular call for it
        if (!cachedLocations[locationSlug]) {
            $http({
                method: 'GET',
                url: apiUrl + locationSlug
            })
            .success(function(data) {
                var location = data.location;
                cachedLocations[locationSlug] = location;
                deferred.resolve(location);
            })
            .error(function(data, status) {
                deferred.resolve(status);
            });
        } else {
            var location = cachedLocations[locationSlug];
            deferred.resolve(location);
        }

        return deferred.promise;
    }

    function getList() {
        var deferred = $q.defer();

        $http({
            method: 'GET',
            url: apiUrl
        })
        .success(function(data) {
            deferred.resolve(data.locations);
        });

        return deferred.promise;
    }

    function updateLocationCache(locationSlug) {
        delete cachedLocations[locationSlug];
        getSingle(locationSlug);
    }

    return {
        getSingle: getSingle,
        getList: getList,
        updateLocationCache: updateLocationCache
    };

})

;
