//= require jquery
//= require jquery_ujs
//= require foundation
//= require angular
//= require angular-ui-router.min
//= require underscore
//= require restangular.min
//= require_tree .

angular.module('deglassified', [
    // Libs
    'restangular',
    'ui.router',
    // Services
    'service.mapbox',
    'service.data-loader',
    // States
    'state.home',
    // Location has a wildcard route, so it must be loaded after all states with an explicit route
    'state.location'
])

.config(function($locationProvider, RestangularProvider) {
    $locationProvider.html5Mode(true);
    RestangularProvider.setBaseUrl('/api');
})

.run(function($rootScope, $state, mapboxService, dataLoader) {

    $rootScope.$on('$stateChangeStart', function(event, toState, toParams, fromState, fromParams) {
        console.log('$stateChangeStart:', arguments);
    });

    $rootScope.loadLocation = function(location) {
        // Need to clear any existing business parameters when swapping locations.
        // Code below not working
        $state.go('location', { location: location.slug, business: '' } );
    };

    $rootScope.showBusiness = function(business) {
        $state.go('location.business', { business: business.slug });
    };
})

;