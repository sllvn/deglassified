angular.module('state.business', ['ui.router', 'service.mapbox'])

.config(function($stateProvider) {
    $stateProvider.state('location.business', {
        url: '/:business',
        controller: 'businessCtrl'
    })
})

.controller('businessCtrl', function($rootScope, $stateParams, mapboxService) {
        // Sort of race condition going on here with the timers, need to find a cleaner way
        // Maybe move the variables from rootScope to private variables inside mapboxService
    var checkForLocationsLoaded = setInterval(function() {
        if ($rootScope.businesses) {
            clearInterval(checkForLocationsLoaded);
            var businessIndex = $rootScope.businesses.filter(function(business) {
                return business.url_slug === $stateParams.business;
            });
            if (businessIndex[0]) {
                $rootScope.pageTitle = businessIndex[0].name;
                mapboxService.openPopupForId(businessIndex[0].id);
            }
        }
    }, 10);

})

;