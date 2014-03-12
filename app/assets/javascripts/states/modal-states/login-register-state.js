angular.module('state.login-register', [
    'ui.router',
    'service.user-account',
    'service.main-modal',
    'directive.error-box'
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
                if (response.status === 'success') {
                    // Successful registration, clear fields in form
                    $scope.loginForm = {};
                    $state.go('add-business.default');
                } else if (response.status === 'failure') {
                    $scope.loginErrors = response.errors;
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
        userAccountService.register($scope.registration.email, $scope.registration.password, $scope.registration.passwordConfirmation)
            .then(function(response) {
                if (response.status === 'success') {
                    // Successful registration, clear fields in form
                    $scope.registration = {};
                    $state.go('add-business.default');
                } else if (response.status === 'failure') {
                    $scope.registrationErrors = response.errors;
                }
            });
        $scope.registration.password = '';
        $scope.registration.passwordConfirmation = '';
    };

})

;
