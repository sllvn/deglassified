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
                        if ($scope.signInError === 'server-down') {
                            console.log('false');
                            $scope.signInError = false;
                        } else {
                            $scope.signInError = 'server-down';
                        }
                        break;
                    case 'failure':
                        $scope.signInError = 'failed-login';
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
        if ($scope.registration.password !== $scope.registration.verifyPassword) {
            $scope.registrationError = 'mismatch-password';
        } else {
            userAccountService.register($scope.registration.email, $scope.registration.password)
                .then(function(response) {
                    console.log(response);
                    switch (response.status) {
                        case 'success':
                            // Successful registration, clear all models in form
                            $scope.registration = {};
                            $state.go('add-business.default');
                            break;
                        case 'server-down':
                            $scope.signInError = 'server-down';
                            break;
                        case 'failure':
                            $scope.registrationError = 'failed-registration';
                            break;
                    }
                });
        }
        $scope.registration.password = '';
        $scope.registration.verifyPassword = '';
    };

})

;
