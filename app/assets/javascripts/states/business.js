angular.module('state.business', ['ui.router', 'service.mapbox'])

.config(function($stateProvider) {
    $stateProvider.state('location.business', {
        url: '/:business',
        controller: 'businessCtrl'
    })
})

.controller('businessCtrl', function($rootScope, $stateParams, mapboxService) {
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