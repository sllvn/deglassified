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
    'ui.router',
    'restangular',
    // Services
    'mapbox-service'
    // States
])

.config(function($locationProvider, RestangularProvider) {
    $locationProvider.html5Mode(true);
    RestangularProvider.setBaseUrl('/api');
})

.run(function($rootScope, Restangular, mapboxService) {
    // Default page title
    $rootScope.pageTitle = 'Home';

    Restangular.all('locations')
        .getList()
        .then(function(data) {
            $rootScope.locations = data.locations;
            $rootScope.currentLocation = $rootScope.locations[0];
            $rootScope.currentCity = $rootScope.currentLocation.city;
            loadBusinesses($rootScope.locations[0]);
    });

    function loadBusinesses(location) {
        Restangular.one('locations', location.id)
            .all('businesses')
            .getList()
            .then(function(data) {
                $rootScope.businesses = data.businesses;
                angular.forEach($rootScope.businesses, function(business) {
                    mapboxService.addBusiness(business);
                });
            })
    }

    $rootScope.loadLocation = function(location) {
        $rootScope.pageTitle = location.city;
        if (location.coordinates) {
            mapboxService.panTo(location.coordinates);
        }
        mapboxService.clearMarkers();
        $('.open').find('.close-reveal-model').click();
        $rootScope.current_location = location;
        loadBusinesses(location);
    };

    $rootScope.showBusiness = function(business) {
        $rootScope.pageTitle = business.name;
        mapboxService.openPopupForId(business.id);
    };
})

;