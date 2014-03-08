angular.module('controller.change-location-modal', [
    'ui.router',
    'service.main-map',
    'service.main-modal'
])

.config(function($stateProvider) {
    $stateProvider.state('change-location', {
        url: '/change-location',
        views: {
            'mainModal': {
                templateUrl: '/partials/change-location-modal.html',
                controller: 'changeLocationModalCtrl',
            }
        },
        onEnter: function($rootScope, mainModalService) {
            $rootScope.pageTitle = 'Change Location';
            mainModalService.openModal();
        }
    });
})

.controller('changeLocationModalCtrl', function($scope, $state, mainMapService) {
    $scope.loadLocation = function(location) {
        mainMapService.clearMarkers();
        // Have to force reloads, as though the parameter for location state is changed, the state controller
        // is not reloaded by default
        $state.go('location', { location: location.slug }, { reload: true } );
    };
})

;
