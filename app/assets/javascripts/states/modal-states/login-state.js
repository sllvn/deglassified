angular.module('state.login', [
    'ui.router',
    'service.user-account',
    'service.main-modal'
])

.config(function($stateProvider) {
    $stateProvider.state('login', {
        url: '/login',
        views: {
            'mainModal': {
                templateUrl: '/partials/login-register-modal.html',
                controller: 'loginCtrl'
            }
        },
        onEnter: function($rootScope, $state, mainModalService, userAccountService) {
            $rootScope.pageTitle = 'Login';
            mainModalService.openModal();
            userAccountService.redirectIfSignedIn('add-business.default');
        }
    }); 
})

.controller('loginCtrl', function($rootScope, $scope, $http, $state, userAccountService) {
    // Need to define these to access the models in the modal
    $scope.loginForm = {};

    $scope.signIn = function() {
        userAccountService.signIn($scope.loginForm.email, $scope.loginForm.password)
            .then(function(response) {
                switch (response.status) {
                    case 'success':
                        $state.go('add-business.default');
                        break;
                    case 'server-down':
                        loadErrorMsg('signInError', 'server-down');
                        break;
                    case 'failure':
                        loadErrorMsg('signInError', 'failed-login');
                        break;
                }
                // Always clear password, regardless of response
                $scope.loginForm.password = '';
            });
    };

    $scope.signOut = function() {
        userAccountService.signOut()
            .then(function(response) {
                if (response.status === 'success') {
                    console.log('Signed out');
                } else {
                    // TODO: Find an appropriate message to the user
                    console.log('Logout failed!');
                }
            });
    };

    $scope.registration = {};

    $scope.register = function() {
        userAccountService.register($scope.registration.email, $scope.registration.password, $scope.registration.verifyPassword)
            .then(function(response) {
                switch (response.status) {
                    case 'success':
                        // Successful registration, clear all models in form
                        $scope.registration = {};
                        $state.go('add-business.default');
                        break;
                    case 'request-failed':
                        loadErrorMsg('registrationError', 'request-failed');
                        break;
                    case 'failure':
                        loadErrorMsg('registrationError', 'password-too-short');
                        break;
                }
            });
        $scope.registration.password = '';
        $scope.registration.verifyPassword = '';
    };

    function loadErrorMsg(errorModel, status) {
        $scope[errorModel] = false;
        setTimeout(function(scope) {
            return function() {
                scope[errorModel] = status;
                scope.$digest();
            };
        }($scope), 1);
    }

})

;
