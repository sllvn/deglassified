angular.module('state.location', [
    'ui.router',
    'state.business',
    'service.location-data',
    'service.main-map'
])

.config(function($stateProvider) {
    $stateProvider.state('location', {
        url: '/:location',
        templateUrl: '/partials/location-data.html',
        controller: 'locationCtrl'
    });

})

.controller('locationCtrl', function($rootScope, $scope,  $state, $stateParams, locationDataService, mainMapService) {
    locationDataService.getSingle($stateParams.location)
        .then(function(locationData) {
            loadLocation(locationData);
        });

    function loadLocation(locationData) {
        if (locationData) {
            $rootScope.pageTitle = locationData.city;
            // Need to bind to rootscope, as it will be used in mainMap service
            // Maybe find a way to pass to mainMap service without rootscope
            $rootScope.currentLocation = locationData;
            $scope.currentCity = locationData.city;
            $scope.businesses = locationData.businesses;

            mainMapService.loadLocation(locationData);
            $scope.mapboxMarkersLoaded = true;
            $scope.$broadcast('mapboxMarkersLoaded');
        } else {
            // Add a 404 state and redirect to instead
//            alert('404: Location not found!');
//            $state.go('home');
        }

    }

})

;
