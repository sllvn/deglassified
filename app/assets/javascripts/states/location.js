angular.module('state.location', [
    'service.mapbox',
    'restangular',
    'ui.router',
    'state.business'
])

.config(function($stateProvider) {
    $stateProvider.state('location', {
        url: '/:location',
        controller: 'locationCtrl'
    });


//    $stateProvider.state('location.root', {
//        url: '',
//        controller: 'locationRootCtrl'
//    })
})

// Need to run this controller ONLY if it is the root of the location state
.controller('locationCtrl', function($rootScope, $stateParams, mapboxService, Restangular) {
    // Setting a delay so that the Restangular call in the main app module can finish binding all locations to
    // $rootScope.  Could make a way to invoke this from main app module, but may complicate things
    var checkForLocationsLoaded = setInterval(function() {
        if ($rootScope.locations) {
            clearInterval(checkForLocationsLoaded);
            // May become unmanagable.  A subset of data just containing existing url_slugs and their index
            // relative to the locations db may be better.  If this was a JSON db, could just store city names as keys
            var locationIndex = $rootScope.locations.filter(function(location) {
                return location.url_slug === $stateParams.location;
            });
            if (locationIndex[0]) {
                $rootScope.pageTitle = locationIndex[0].city;
                mapboxService.loadLocation(locationIndex[0]);
            } else {
//                'state.go 404 page'
            }

        }
    }, 100);

// If we knew which url slugs corresponded to which index to which row in the locations, we wouldn't need to wait
// for the main Restangular getList(), and could just use one()
//    Restangular.one('locations', locationIndex)
//        .get()
//        .then(function(data) {
//            loadLocation(data.location)
//        });

})

;