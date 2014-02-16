angular.module('service.data-loader', ['restangular'])

// Find a way to run this without having to inject service in a controller
.service('dataLoader', function($rootScope, $q, Restangular) {



    // Retrieve the list of all locations.  Used for the 'change location' modal
    var getAllLocations = function() {
        var deferred = $q.defer();
        Restangular.all('locations')
            .getList()
            .then(function(data) {
                deferred.resolve(data);
            });
        return deferred.promise;
    };

    getAllLocations()
        .then(
        function(data) {
            $rootScope.locations = data.locations;
            $rootScope.$emit('allLocationsLoaded', data);
        }
    );


    $rootScope.$on('getBusinessesForLocation', function(location) {
        retrieveBusinessesForLocation(location).then(
            function(data) {
                $rootScope.businesses = data.businesses;
                $rootScope.$emit('businessesLoaded');
            }
        );
    });

    var retrieveBusinessesForLocation = function(location) {
        var deferred = $q.defer();
        Restangular.one('locations', location.id)
            .all('businesses')
            .getList()
            .then(function(data) {
                deferred.resolve(data);
            });
        return deferred.promise;
    };

})

;