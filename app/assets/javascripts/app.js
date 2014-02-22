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
    'service.user-account',

    // Controllers
    'controller.main-modal',
    'controller.change-location-modal',

    // States
    'state.home',
    // Location has a wildcard route, so it must be loaded after all states with an explicit route
    'state.location'
])

.config(function($locationProvider) {
    $locationProvider.html5Mode(true);
})

.run(function(userAccountService) {
    userAccountService.initUserData();
})

.controller('sideBarCtrl', function($rootScope, $scope, $state, $modal, locationDataService) {
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

;