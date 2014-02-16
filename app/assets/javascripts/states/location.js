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
})

.controller('locationCtrl', function($rootScope, $state, $stateParams, mapboxService, Restangular) {
    $rootScope.$on('locationDatabaseLoaded', function(event, data) {
        $rootScope.locations = data.locations;
        console.log($rootScope.locations);
//        $rootScope.currentLocation = $rootScope.locations[0];
        loadLocation();
    });

    if ($rootScope.locations) {
        loadLocation();

    }



    function loadLocation() {
        var currentLocation = findLocationByUrlslug();

        if (currentLocation) {
            $rootScope.pageTitle = currentLocation.city;
            $rootScope.currentLocation = currentLocation;
            $rootScope.currentCity = $rootScope.currentLocation.city;
            mapboxService.loadLocation(currentLocation);
            $rootScope.$emit('loadBusinessesForLocation', currentLocation);
        } else {
            // Add a 404 state and redirect to instead
            alert('404: Location not found!');
            $state.go('home');
        }
    }


    function findLocationByUrlslug() {
        for(var i = 0; i < $rootScope.locations.length; i++) {
            if ($rootScope.locations[i].url_slug === $stateParams.location) {
                return $rootScope.locations[i];
            }
        }
        return false;
    }

})

;