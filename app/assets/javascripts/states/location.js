angular.module('state.location', [
    'ui.router',
    'state.business',
    'service.load-single-location'
])

.config(function($stateProvider) {
    $stateProvider.state('location', {
        url: '/:location',
        templateUrl: '/partials/location-data.html',
        controller: 'locationCtrl'
    });

})

.controller('locationCtrl', function($rootScope, $scope,  $state, $stateParams, loadSingleLocation, mapboxService) {
    console.log('locationload');
    loadSingleLocation.load($stateParams.location)
        .then(function(locationData) {
            loadLocation(locationData);
        });

    function loadLocation(locationData) {
        if (locationData) {
            $rootScope.pageTitle = locationData.city;
            $scope.currentLocation = locationData;
            $scope.currentCity = locationData.city;
            $scope.businesses = locationData.businesses;

            mapboxService.loadLocation(locationData);
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