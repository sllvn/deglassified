angular.module('state.business', ['ui.router', 'service.mapbox'])

.config(function($stateProvider) {
    $stateProvider.state('location.business', {
        url: '/:business',
        controller: 'businessCtrl'
    })
})

.controller('businessCtrl', function($rootScope, $stateParams, mapboxService) {
    console.log('business');
    // Will only be triggered on the page load, when it must first wait for $rootScope.businesses to be set
    $rootScope.$on('businessesLoadedInMapbox', loadBusiness);

    if ($rootScope.businessesLoadedInMapbox) {
        loadBusiness();
    }

    function loadBusiness() {
        var business = findBusinessFromLocation($stateParams.business);
        if (business) {
            $rootScope.pageTitle = business.name;
            mapboxService.openPopupForId(business.id);
        }
    }

    function findBusinessFromLocation(businessSlug) {
        for(var i = 0; i < $rootScope.businesses.length; i++) {
            if ($rootScope.businesses[i].slug === businessSlug) {
                return $rootScope.businesses[i];
            }
        }
        return false;
    }


})

;