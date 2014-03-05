//= require angular
//= require angular-animate.min
//= require mm-foundation-tpls-0.1.0.min
//= require angular-local-storage.min
//= require angular-ui-router.min
//= require jquery
//= require custom-foundation.min
//= require_tree .

$(document).foundation();

angular.module('deglassified', [
    // Libs
    'ui.router',
    'ngAnimate',
    'mm.foundation',

    // Services
    'service.location-data',
    'service.user-account',

    // Controllers
    'controller.side-bar',
    'controller.change-location-modal',

    // States
    'state.home',
    'state.login',
    'state.add-business',
    // Location has a wildcard route, so it must be loaded after all states with an explicit route
    'state.location'
])

.config(function($locationProvider, $httpProvider) {
    $httpProvider.defaults.useXDomain = true;
    delete $httpProvider.defaults.headers.common['X-Requested-With'];
    $locationProvider.html5Mode(true);
})

.run(function(userAccountService) {
    userAccountService.initUserData();
})

;
