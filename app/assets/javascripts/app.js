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
    // Animations are working without loading the animate module???
//    'ngAnimate',

    // Services
    'service.load-single-location',
    'service.load-locations-list',
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

.run(function($rootScope, $state, $modal, mapboxService, loadSingleLocation) {

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
        // Need to clear any existing business parameters when swapping locations.
        // Code below not working
        $state.go('location', { location: location.slug } );
    };

    $rootScope.showBusiness = function(business) {
        $state.go('location.business', { business: business.slug });
    };
})

;