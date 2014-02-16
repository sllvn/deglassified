angular.module('state.business', ['ui.router', 'service.mapbox'])

.config(function($stateProvider) {
    $stateProvider.state('location.business', {
        url: '/:business',
        controller: 'businessCtrl'
    })
})

.controller('businessCtrl', function($rootScope, $stateParams, mapboxService) {
    // Will only be triggered on the page load, when it must first wait for $rootScope.businesses to be set
    $rootScope.$on('businessesDone', loadBusiness);
    if ($rootScope.businesses) {
        loadBusiness();
    }

    function loadBusiness() {
        var business;
        for(var i = 0; i < $rootScope.businesses.length; i++) {
            if ($rootScope.businesses[i].url_slug === $stateParams.business) {
                business = $rootScope.businesses[i];
                break;
            }
        }
        if (business) {
            console.log(business.id);
            $rootScope.pageTitle = business.name;
            mapboxService.openPopupForId(business.id);
        }
    }


})

;