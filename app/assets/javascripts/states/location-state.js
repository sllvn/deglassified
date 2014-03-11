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

.controller('locationCtrl', function($rootScope, $scope, $state, $stateParams, locationDataService, mainMapService) {
    locationDataService.getSingle($stateParams.location)
        .then(function(response) {
            if (response === 404) {
                $state.go('404');
            } else if (response.slug) {
                loadLocation(response);
            }
        });

    function loadLocation(locationData) {
        $rootScope.pageTitle = locationData.city;
        $rootScope.currentLocation = locationData;
        $scope.currentCity = locationData.city;
        $scope.businesses = locationData.businesses;

        mainMapService.loadLocation(locationData);
        $scope.mapboxMarkersLoaded = true;
        $scope.$broadcast('mapboxMarkersLoaded');
    }

})

;
