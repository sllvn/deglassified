angular.module('state.home', ['ui.router'])

.config(function($stateProvider) {
    $stateProvider.state('home', {
        url: '/',
        pageTitle: 'Home',
        controller: 'homeCtrl'
    });
})

.controller('homeCtrl', function($rootScope) {
    $rootScope.pageTitle = 'Home';
})

;