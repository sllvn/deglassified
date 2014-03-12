angular.module('state.404', [
    'ui.router',
    'service.main-modal'
])

.config(function($stateProvider) {
    $stateProvider.state('404', {
        views: {
            'mainModal': {
                templateUrl: '/partials/404.html',
                controller: '404Ctrl'
            }
        },
        onEnter: function($rootScope, mainModalService) {
            $rootScope.pageTitle = '404 - Page Not Found';
            mainModalService.openModal();
        }
    });
})

.controller('404Ctrl', function($scope) {
    $scope.url = window.location.href.replace(/http:\/\//, '');
})

;
