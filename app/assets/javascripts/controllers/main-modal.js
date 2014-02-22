//= require mapbox.js

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
                        break;
                }
                // Always clear password, regardless of response
                $scope.login.password = '';
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

    $scope.findLocation = function() {
        loadMinimap();
    };

    function loadMinimap() {
        var mapElement = 'minimap',
            defaultView = [47.603569, -122.329453],
            defaultZoom = 12,
            map = L.mapbox.map(mapElement, 'licyeus.gg3718oi').setView(defaultView, defaultZoom);

        var geoJSON = {
            type: 'FeatureCollection',
            features: []
        };

        var markerLayer = L.mapbox.markerLayer();
    }

})

;