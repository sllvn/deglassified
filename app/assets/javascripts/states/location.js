angular.module('state.location', [
    'ui.router',
    'state.business',
    'service.load-single-location'
])

.config(function($stateProvider) {
    $stateProvider.state('location', {
        url: '/:location',
        // Load a second ui-view so that the child states can attach and execute their controllers
        template: '<div ui-view></div>',
        controller: 'locationCtrl'
    });

})

.controller('locationCtrl', function($rootScope, $state, $stateParams, loadSingleLocation) {
    console.log('single load');

    $rootScope.$emit('getLocationData', $stateParams.location);

    // This watcher will only be triggered once, which is after the initial DB load of all locations.
    $rootScope.$on('locationDataRetrieved', function(event, locationData) {
        loadLocation(locationData);
    });

    function loadLocation(locationData) {
        if (locationData) {
            $rootScope.pageTitle = locationData.city;
            $rootScope.currentLocation = locationData;
            $rootScope.currentCity = locationData.city;
        } else {
            // Add a 404 state and redirect to instead
//            alert('404: Location not found!');
//            $state.go('home');
        }
    }

})

;