angular.module('state.add-business', [
    'ui.router',
    'ngCookies',
    'service.user-account',
    'service.mini-map',
    'service.main-modal',
    'state.add-business.page-1',
    'state.add-business.page-2'
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
            userAccountService.redirectIfNotSignedIn('login');
        }
    }); 

    $stateProvider.state('add-business.default', {
        url: '',
        onEnter: function($state) {
            $state.go('add-business.page-1');
        }
    });
})

.controller('addBusinessCtrl', function($scope, $http, $q, $state, userAccountService, miniMapService, locationDataService, mainModalService, $cookieStore) {
    $scope.userEmail = userAccountService.getUser().email;

    $scope.signOut = function() {
        userAccountService.signOut()
            .then(function(response) {
                $state.go('login');
            });
    };

    $scope.business = {};
    // Stub data
    $scope.business.address = '1311 12th avenue south, Seattle, WA 98144';
    $scope.business.name = 'Deglassified Inc.';

    var businessFormCookie = $cookieStore.get('addBusinessForm');
    if (businessFormCookie) {
        $scope.business = businessFormCookie;
        console.log('cookie loaded');
    } 

    $scope.$watch($scope.business, function() {
        console.log('one add');
        $cookieStore.put('addBusinessForm', $scope.business);   
    });

})

;
