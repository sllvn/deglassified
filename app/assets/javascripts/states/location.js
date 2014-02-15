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
    $rootScope.$on('locationsLoaded', function() {
        var locationIndex;
        for(var i = 0; i < $rootScope.locations.length; i++) {
            if ($rootScope.locations[i].url_slug === $stateParams.location) {
                locationIndex = $rootScope.locations[i];
                break;
            }
        }
        if (locationIndex) {
            $rootScope.pageTitle = locationIndex.city;
            mapboxService.loadLocation(locationIndex);
        } else {
            // Add a 404 state and redirect to instead
            alert('404: Location not found!');
            $state.go('home');
        }
    });
})

;