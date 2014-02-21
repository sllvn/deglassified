//= require angular
//= require mm-foundation-tpls-0.1.0.min
//= require angular-local-storage.min
//= require angular-ui-router.min
//= require_tree .

angular.module('deglassified', [
    // Libs
    'ui.router',
    'mm.foundation',

    // Services
    'service.location-data',
    'service.mapbox',

    // States
    'state.home',
    // Location has a wildcard route, so it must be loaded after all states with an explicit route
    'state.location'
])

.config(function($locationProvider) {
    $locationProvider.html5Mode(true);
})

.controller('sideBarCtrl', function($scope, $state, $modal, mapboxService, locationDataService) {
    locationDataService.getList()
        .then(function(locationsList) {
            $scope.locations = locationsList;
        });

    // Could move this into their own service, like loadModals() or setModals()
    $scope.openLoginSignupModal = function() {
        $modal.open({
            templateUrl: '/partials/main-modal.html'
        });
    };

    $scope.openLocationModal = function() {
        $modal.open({
            templateUrl: '/partials/change-location-modal.html'
        });
    };

    $scope.loadLocation = function(location) {
        mapboxService.clearMarkers();
        // Have to force reloads, as though the parameter for location state is changed, the state controller
        // is not reloaded by default
        $state.go('location', { location: location.slug }, { reload: true } );
    };

    $scope.showBusiness = function(business) {
        $state.go('location.business', { business: business.slug }, { reload: true });
    };
})

.controller(function() {
    console.log($scope.signInForm);
})

;