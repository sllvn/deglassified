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
    // $rootScope.  Could make a way to invoke this from main app module, but may complicate things
    var checkForLocationsLoaded = setInterval(function() {
        if ($rootScope.locations) {
            clearInterval(checkForLocationsLoaded);
            // May become unmanage.  A subset of data just containing existing url_slugs and their index
            // relative to the locations db may be better.  If this was a JSON db, could just store city names as keys
            locationIndex = $rootScope.locations.filter(function(location) {
                return location.url_slug === $stateParams.location;
            });
            locationIndex[0] && loadLocation(locationIndex[0]);
        }
    }, 100);

// If we knew which url slugs corresponded to which index to which row in the locations, we wouldn't need to wait
// for the main Restangular getList(), and could just use one()
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
        $('.open').find('.close-reveal-modal').click();
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