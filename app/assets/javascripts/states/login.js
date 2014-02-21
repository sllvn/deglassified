angular.module('state.login', [
    'ui.router',
    'mm.foundation',
    'service.user-account'
])

.config(function($stateProvider) {
    $stateProvider.state('login', {
        url: '/login',
        onEnter: function($modal) {
            console.log('login');
            $modal.open({
                templateUrl: '/partials/main-modal.html'
            });
        },
        controller: 'modalCtrl'
    })
})

.controller('modalCtrl', function($scope, $state, userAccountService) {
    $scope.signedIn = false;

    $scope.signIn = function(email, password) {
        console.log(email + ' ' + password);
        userAccountService.signIn(email, password)
            .then(function(response) {
                if (response.status === 'success') {
                    $scope.signedIn = true;
                    console.log('signed in');
                } else {
                    console.log('Login failed!');
                    $scope.showSignInError = true;
                    setTimeout(function() {
                        $scope.showSignInError = false;
                    }, 3000);
                }
            });
    };

    $scope.signOut = function() {
        userAccountService.signOut()
            .then(function(response) {
                if (response.status === 'success') {
                    $scope.signedIn = false;
                    console.log('Signed out');
                } else {
                    // TODO: Find an appropriate message to the user
                    console.log('Logout failed!');
                }
            });
    };
})

;