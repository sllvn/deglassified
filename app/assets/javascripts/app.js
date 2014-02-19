//= require angular
//= require mm-foundation-tpls-0.1.0.min
//= require angular-ui-router.min
//= require underscore
//= require restangular.min
//= require_tree .

angular.module('deglassified', [
    // Libs
    'restangular',
    'ui.router',
    'mm.foundation',
//    'ngAnimate',

    // Services
    'service.location-data',
    'service.mapbox',
    // States
    'state.home',
    // Location has a wildcard route, so it must be loaded after all states with an explicit route
    'state.location'
])

.config(function($locationProvider, RestangularProvider) {
    $locationProvider.html5Mode(true);
    RestangularProvider.setBaseUrl('/api');
})

.run(function($rootScope, $state, $modal, locationDataService) {
    locationDataService.getList()
        .then(function(locationsList) {
            $rootScope.locations = locationsList;
        });

    $rootScope.openLoginSignupModal = function() {
        $modal.open({
            templateUrl: '/partials/login-signup-modal.html'
        });
    };

    $rootScope.openLocationModal = function() {
        $modal.open({
            templateUrl: '/partials/change-location-modal.html'
        });
    };

    $rootScope.loadLocation = function(location) {
        // Have to set so that if mapbox closes a popup, it does try to reload back to old location
        $rootScope.currentLocation = location;
        // Have to force reloads, as though the parameter for location state is changed, the state controller
        // is not reloaded by default
        $state.go('location', { location: location.slug }, { reload: true } );
    };

    $rootScope.showBusiness = function(business) {
        $state.go('location.business', { business: business.slug }, { reload: true });
    };
})

;