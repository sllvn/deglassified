angular.module('service.load-locations-list', ['restangular'])

.run(function($rootScope, Restangular) {
    Restangular.one('locations')
        .get()
        .then(function(data) {
            $rootScope.locations = data.locations;
        });
})

;