angular.module('controller.side-bar', [])

.controller('sideBarCtrl', function($rootScope, $scope, $state, $modal, locationDataService) {
    // Gets list of locations from REST server, stores in $rootScope
    locationDataService.getList()
        .then(function(locationsList) {
            // As the data will be used in a modal being appended to the DOM, have to store in rootScope.
            $rootScope.locations = locationsList;
        });

    $scope.openLocationModal = function() {
        $modal.open({ templateUrl: '/partials/change-location-modal.html' });
    };

    $scope.showBusiness = function(business) {
        $state.go('location.business', { business: business.slug }, { reload: true });
    };
})

;
