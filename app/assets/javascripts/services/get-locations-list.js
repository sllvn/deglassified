angular.module('service.get-locations-list', ['restangular'])

.service('getLocationsListService', function($rootScope, $q, Restangular) {
    return function() {
        var deferred = $q.defer();
        Restangular.one('locations')
            .get()
            .then(function(data) {
                deferred.resolve(data.locations);
            });
        return deferred.promise;
    }

})

;