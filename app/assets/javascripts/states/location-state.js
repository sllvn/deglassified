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

.controller('locationCtrl', function($rootScope, $scope, $state, $stateParams, mainMapService, locationDataService) {
    locationDataService.getSingle($stateParams.location)
        .then(function(locationData) {
            if (locationData === 404) {
                $state.go('404');
            } else if (locationData.slug) {
                loadLocation(locationData);
            }
        });

    function loadLocation(locationData) {
        $rootScope.pageTitle = locationData.city;
        $rootScope.currentLocation = locationData;
        $scope.currentCity = locationData.city;
        $scope.businesses = locationData.businesses;
        loadLocationInMapbox(locationData);
    }

    function loadLocationInMapbox(locationData) {
        mainMapService.loadLocation(locationData);
        $scope.mapboxMarkersLoaded = true;
        $scope.$broadcast('mapboxMarkersLoaded');
    }

})

;
