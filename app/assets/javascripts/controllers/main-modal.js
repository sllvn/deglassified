angular.module('controller.main-modal', [
    'ui.router',
    'service.user-account'
])

.controller('mainModalCtrl', function($rootScope, $scope, $state, userAccountService) {
    $rootScope.signedIn = false;
    // Need to define these to access the models in the modal
    $scope.user = {};

    $scope.signIn = function(email, password) {
        userAccountService.signIn($scope.user.email, $scope.user.password)
            .then(function(response) {
                if (response === 'server-down') {
                    $scope.signInError = 'server-down';
                } else if (response === 'success') {
                    $rootScope.signedIn = true;
                } else if (response === 'failure') {
                    $scope.signInError = 'failed-login';
                    // Only reset the password on failed login
                    $scope.user.password = '';
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
                    $rootScope.signedIn = false;
                    console.log('Signed out');
                } else {
                    // TODO: Find an appropriate message to the user
                    console.log('Logout failed!');
                }
            });
    };
})

;