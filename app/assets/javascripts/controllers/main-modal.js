angular.module('controller.main-modal', [
    'ui.router',
    'service.user-account'
])

.controller('mainModalCtrl', function($rootScope, $scope, $state, userAccountService) {
    // Need to define these to access the models in the modal
    $scope.login = {};

    $scope.signIn = function() {
        userAccountService.signIn($scope.login.email, $scope.login.password)
            .then(function(response) {
                switch (response.status) {
                    case 'success':
                        break;
                    case 'server-down':
                        $scope.signInError = 'server-down';
                        break;
                    case 'failure':
                        $scope.signInError = 'failed-login';
                        $scope.login.password = '';
                        break;
                }
                // Set the timeout to disappear
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
            $scope.registration.password = '';
            $scope.registration.verifyPassword = '';
        } else {
            userAccountService.register($scope.registration.email, $scope.registration.password)
                .then(function(response) {
                    console.log(response);
                    switch (response.status) {
                        case 'success':
                            break;
                        case 'server-down':
                            $scope.signInError = 'server-down';
                            break;
                        case 'failure':
                            $scope.registrationError = 'failed-registration';
                            $scope.registration.password = '';
                            break;
                    }
                })
        }
    };


})

;