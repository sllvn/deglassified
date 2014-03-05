angular.module('state.add-business', [
    'ui.router',
    'service.user-account',
    'service.mini-map',
    'service.main-modal',
    'state.add-business.page-1'
]) 

.config(function($stateProvider) {
    $stateProvider.state('add-business', {
        abstract: true,
        url: '/add-business',
        views: {
            'mainModal': {
                templateUrl: '/partials/add-business.html',
                controller: 'addBusinessCtrl'
            }
        },
        onEnter: function($rootScope, $state, mainModalService, userAccountService) {
            $rootScope.pageTitle = 'Add Business';
            mainModalService.openModal();
            userAccountService.redirectToLoginIfNotSignedIn();
        }
    }); 

    $stateProvider.state('add-business.default', {
        url: '',
        onEnter: function($state) {
            $state.go('add-business.page-1');
        }
    });
})

.controller('addBusinessCtrl', function($scope, $http, $q, $state, userAccountService, miniMapService, locationDataService, mainModalService) {
    $scope.userEmail = userAccountService.getUser().email;
})

;
