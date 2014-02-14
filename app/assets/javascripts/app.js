//= require jquery
//= require jquery_ujs
//= require foundation
//= require angular
//= require underscore
//= require restangular.min
//= require_tree .

angular.module('deglassified', [
    'restangular',
    'mapbox-service'
])

.config(function(RestangularProvider) {
    RestangularProvider.setBaseUrl('/api');
})

.run(function($rootScope, Restangular, mapboxService) {
    // Default page title
    $rootScope.pageTitle = 'Home';

    Restangular.all('locations')
        .getList()
        .then(function(data) {
            var locations = data.locations;
            $rootScope.currentLocation = locations[0];
            $rootScope.currentCity = $rootScope.currentLocation.city;
            loadBusinesses(locations[0]);
    });

    function loadBusinesses(location) {
        Restangular.one('locations', location.id)
            .all('businesses')
            .getList()
            .then(function(data) {
                var businesses = data.businesses;
                angular.forEach(businesses, function(business) {
                    mapboxService.addBusiness(business);
                });
            })
    }

    function loadLocation(location) {
        if (location.coordinates) {
            mapboxService.panTo(location.coordinates);
        }
        mapboxService.clearMarkers();
        $('.open').find('.close-reveal-model').click();
        $rootScope.current_location = location;
        loadBusinesses(location);
    }

    function showBusiness(business) {
        mapboxService.openPopupForId(business.id);
    }
})

;