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

    $rootScope.locations = [
        {
            city: 'Seattle',
            slug: 'seattle'
        },
        {
            city: 'Las Vegas',
            slug: 'las-vegas'
        }
    ];

    $rootScope.loadLocation = function(location) {
        $state.go('location', { location: location.slug } );
    };

    $rootScope.showBusiness = function(business) {
        $state.go('location.business', {  business: business.slug });
    };
})

;