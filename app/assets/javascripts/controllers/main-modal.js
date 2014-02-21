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
                switch (response) {
                    case 'success':
                        $rootScope.signedIn = true;
                        break;
                    case 'server-down':
                        $scope.signInError = 'server-down';
                        break;
                    case 'failure':
                        $scope.signInError = 'failed-login';
                        $scope.user.password = '';
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