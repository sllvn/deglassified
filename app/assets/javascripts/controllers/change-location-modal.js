angular.module('controller.change-location-modal', [
    'ui.router',
    'service.mapbox'
])

.controller('changeLocationModalCtrl', function($scope, $state, mapboxService) {
    $scope.loadLocation = function(location) {
        mapboxService.clearMarkers();
        // Have to force reloads, as though the parameter for location state is changed, the state controller
        // is not reloaded by default
        $state.go('location', { location: location.slug }, { reload: true } );
    };
})

;