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
        onEnter: function($rootScope, mainModalService) {
            $rootScope.pageTitle = 'Login';
            mainModalService.openModal();
        }
    }); 
})

.controller('loginCtrl', function($rootScope, $scope, $state, $http, $state, userAccountService) {
    // Need to define these to access the models in the modal
    $scope.loginForm = {};
    // Stub data
    $scope.loginForm.email = 'someone@example.com';
    $scope.loginForm.password = 'somepassword';

    $scope.signIn = function() {
        userAccountService.signIn($scope.loginForm.email, $scope.loginForm.password)
            .then(function(response) {
                switch (response.status) {
                    case 'success':
                        $state.go('add-business');
                        break;
                    case 'server-down':
                        $scope.signInError = 'server-down';
                        break;
                    case 'failure':
                        $scope.signInError = 'failed-login';
                        break;
                }
                // Always clear password, regardless of response
                $scope.loginForm.password = '';
                // Set the alert box to disappear
                setTimeout(function() {
                    $scope.signInError = false;
                }, 3000);
            });
    };

    $scope.signOut = function() {
        userAccountService.signOut()
            .then(function(response) {
                if (response.status === 'success') {
                    $rootScope.user.signedIn = false;
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
