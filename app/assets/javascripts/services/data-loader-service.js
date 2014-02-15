angular.module('service.data-loader', ['restangular'])

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

    var promiseLocations = retrieveLocations();
    promiseLocations.then(
        function(data) {
            setRootScopeData(data);
            // Instead of passing the data in $emit's arguments, set the data to $rootScope, as it will be used in the
            // DOM bindings
            $rootScope.$emit('locationsLoaded');
            // Now that locations are loaded, set the promise for loading businesses
            var promiseBusinesses = retrieveBusinesses();
            promiseBusinesses.then(
                function(data) {
                    $rootScope.businesses = data.businesses;
                    $rootScope.$emit('businessesLoaded');
                }
            );
        },
        function(error) {
            console.log(error);
        }
    );

    function setRootScopeData(data) {
        $rootScope.locations = data.locations;
        $rootScope.currentLocation = $rootScope.locations[0];
        $rootScope.currentCity = $rootScope.currentLocation.city;
        console.log('set');
    }

    var retrieveBusinesses = function() {
        var deferred = $q.defer();
        Restangular.one('locations', $rootScope.currentLocation.id)
            .all('businesses')
            .getList()
            .then(function(data) {
                deferred.resolve(data);
            });
        return deferred.promise;
    };

})

;