angular.module('controller.change-location-modal', [
    'ui.router',
    'service.main-map'
])

.controller('changeLocationModalCtrl', function($scope, $state, mainMapService) {
    $scope.loadLocation = function(location) {
        mainMapService.clearMarkers();
        // Have to force reloads, as though the parameter for location state is changed, the state controller
        // is not reloaded by default
        $state.go('location', { location: location.slug }, { reload: true } );
    };
})

;
