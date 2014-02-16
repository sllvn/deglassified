angular.module('service.data-loader', ['restangular'])

// Find a way to run this without having to inject service in a controller
.service('dataLoader', function($rootScope, $q, Restangular) {
    var retrieveLocations = function() {
        var deferred = $q.defer();
        Restangular.all('locations')
            .getList()
            .then(function(data) {
                deferred.resolve(data);
            });
        return deferred.promise;
    };

    retrieveLocations()
        .then(
        function(data) {
            // Instead of passing the data in $emit's arguments, set the data to $rootScope, as it will be used in the
            // DOM bindings
            $rootScope.$emit('locationDatabaseLoaded', data);
        }
    );

    $rootScope.$on('loadBusinessesForLocation', function(currentLocation) {
        retrieveBusinesses(currentLocation).then(
            function(data) {
                $rootScope.businesses = data.businesses;
                $rootScope.$emit('businessesLoaded');
            }
        );
    });

    var retrieveBusinesses = function(currentLocation) {
        var deferred = $q.defer();
            Restangular.one('locations', currentLocation.id)
            .all('businesses')
            .getList()
            .then(function(data) {
                deferred.resolve(data);
            });
        return deferred.promise;
    };

})

;