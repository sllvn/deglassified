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
    'service.user-account',
    // States
    'state.home',
    // Location has a wildcard route, so it must be loaded after all states with an explicit route
    'state.location'
])

.config(function($locationProvider) {
    $locationProvider.html5Mode(true);
})

.run(function($rootScope, $state, $modal, locationDataService, mapboxService, userAccountService) {
    $rootScope.signedIn = false;

    $rootScope.signIn = function() {
        loginDetails = {
            user: {
                email: $rootScope.name,
                password: $rootScope.password
            }
        }
        userAccountService.signIn(loginDetails)
            .then(function(response) {
                if (response.status === 'success') {
                    $rootScope.signedIn = true;
                    console.log('signed in');
                } else {
                    // TODO: Find an appropriate message to the user
                    console.log('Login failed!');
                }
            });
    };

    $rootScope.signOut = function() {
        userAccountService.signOut()
            .then(function(response) {
                if (response.status === 'success') {
                    $rootScope.signedIn = false;
                    console.log('Signed out');
                } else {
                    // TODO: Find an appropriate message to the user
                    console.log('Logout failed!');
                }
            });
    };

    locationDataService.getList()
        .then(function(locationsList) {
            $rootScope.locations = locationsList;
        });


    // Could move this into their own service, like loadModals() or setModals()
    $rootScope.openLoginSignupModal = function() {
        $modal.open({
            templateUrl: '/partials/main-modal.html'
        });
    };

    $rootScope.openLocationModal = function() {
        $modal.open({
            templateUrl: '/partials/change-location-modal.html'
        });
    };

    $rootScope.loadLocation = function(location) {
        mapboxService.clearMarkers();
        // Have to force reloads, as though the parameter for location state is changed, the state controller
        // is not reloaded by default
        $state.go('location', { location: location.slug }, { reload: true } );
    };

    $rootScope.showBusiness = function(business) {
        $state.go('location.business', { business: business.slug }, { reload: true });
    };
})

;