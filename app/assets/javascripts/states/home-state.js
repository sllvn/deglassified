angular.module('state.home', ['ui.router'])

.config(function($stateProvider) {
    $stateProvider.state('home', {
        url: '/',
        pageTitle: 'Home',
        controller: 'homeCtrl'
    });
})

.controller('homeCtrl', function($rootScope, $state) {
    $rootScope.pageTitle = 'Home';
    var defaultLocation = 'seattle';
    // Default redirect.  Should make this customize based upon user IP location
    $state.go('location', { location: defaultLocation });
})

;
