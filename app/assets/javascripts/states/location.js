angular.module('state.location', ['service.mapbox', 'restangular'])

.config(function($stateProvider) {
    $stateProvider.state('location', {
        url: '/:location',
        controller: 'locationCtrl'
    });
})

.controller('locationCtrl', function($rootScope, $stateParams, mapboxService, Restangular) {
    var locationIndex;

    // Setting a delay so that the Restangular call in the main app module can finish binding all locations to
    // $rootScope
    setTimeout(function() {
        locationIndex = $rootScope.locations.filter(function(location) {
            return location.url_slug === $stateParams.location;
        });
        loadLocation(locationIndex[0]);
    }, 100);

// Alternatively, make a way to find the locationIndex without waiting for the main Restangular location getList()
//    Restangular.one('locations', locationIndex)
//        .get()
//        .then(function(data) {
//            loadLocation(data.location)
//        });

    function loadLocation(location) {
        $rootScope.pageTitle = location.city;
        if (location.coordinates) {
            mapboxService.panTo(location.coordinates);
        }
        mapboxService.clearMarkers();
        $('.open').find('.close-reveal-model').click();
        $rootScope.current_location = location;
        loadBusinesses(location);

        function loadBusinesses(location) {
            Restangular.one('locations', location.id)
                .all('businesses')
                .getList()
                .then(function(data) {
                    $rootScope.businesses = data.businesses;
                    angular.forEach($rootScope.businesses, function(business) {
                        mapboxService.addBusiness(business);
                    });
                })
        }

    }

})

;