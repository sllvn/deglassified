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
    // States
    'state.home',
    // Location has a wildcard route, so it must be loaded after all states with an explicit route
    'state.location'
])

.config(function($locationProvider, RestangularProvider) {
    $locationProvider.html5Mode(true);
    RestangularProvider.setBaseUrl('/api');
})

.run(function($rootScope, $state, Restangular, mapboxService) {
    Restangular.all('locations')
        .getList()
        .then(function(data) {
            $rootScope.locations = data.locations;
            $rootScope.currentLocation = $rootScope.locations[0];
            $rootScope.currentCity = $rootScope.currentLocation.city;
            mapboxService.loadBusinesses($rootScope.locations[0]);
    });

    $rootScope.loadLocation = function(location) {
        $state.go('location', { location: location.url_slug });
    };

    $rootScope.showBusiness = function(business) {
        $state.go('location.business', { business: business.url_slug });
    };
})

;