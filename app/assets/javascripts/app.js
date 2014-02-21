//= require angular
//= require angular-animate.min
//= require mm-foundation-tpls-0.1.0.min
//= require angular-local-storage.min
//= require angular-ui-router.min
//= require_tree .

angular.module('deglassified', [
    // Libs
    'ui.router',
    'ngAnimate',
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

.controller('sideBarCtrl', function($rootScope, $scope, $state, $modal,  locationDataService) {
    // Gets list of locations from REST server, stores in $rootScope
    locationDataService.getList()
        .then(function(locationsList) {
            // As the data will be used in a modal being appended to the DOM, have to store in rootScope.
            $rootScope.locations = locationsList;
        });

    // Could move this into their own service, like loadModals() or setModals()
    $scope.openLoginSignupModal = function() {
        $modal.open({ templateUrl: '/partials/main-modal.html' });
    };

    $scope.openLocationModal = function() {
        $modal.open({ templateUrl: '/partials/change-location-modal.html' });
    };

    $scope.showBusiness = function(business) {
        $state.go('location.business', { business: business.slug }, { reload: true });
    };
})

.controller('changeLocationModalCtrl', function($scope, $state, mapboxService) {
    $scope.loadLocation = function(location) {
        mapboxService.clearMarkers();
        // Have to force reloads, as though the parameter for location state is changed, the state controller
        // is not reloaded by default
        $state.go('location', { location: location.slug }, { reload: true } );
    };
})

.controller('modalCtrl', function($rootScope, $scope, $state, userAccountService) {
    $rootScope.signedIn = false;
    // Need to define these to access the models in the modal
    $scope.user = {};

    $scope.signIn = function(email, password) {
        userAccountService.signIn($scope.user.email, $scope.user.password)
            .then(function(response) {
                if (response === 'server-down') {
                    $scope.signInError = 'server-down';
                } else if (response === 'success') {
                    $rootScope.signedIn = true;
                } else if (response === 'failure') {
                    $scope.signInError = 'failed-login';
                    // Only reset the password on failed login
                    $scope.user.password = '';
                }
                // Set the timeout to disappear
                setTimeout(function() {
                    $scope.signInError = false;
                }, 3000);
            });
    };

    $scope.signOut = function() {
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
})

;