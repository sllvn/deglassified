angular.module('state.business', ['ui.router', 'service.mapbox'])

.config(function($stateProvider) {
    // For when a location has a trailing slash but no business slug.  Ex: '/seattle/'.
    // Since ui-router routes based on injected order, must define this default root state before the business state.
    // If there was a priority rule for hard coded urls to be loaded first, could move this to state.location module
    $stateProvider.state('location.root', {
        url: '/',
        controller: function($state) {
            $state.go('location');
        }
    });

    $stateProvider.state('location.business', {
        url: '/:business',
        controller: 'businessCtrl'
    });
})

.controller('businessCtrl', function($rootScope, $state, $stateParams, mapboxService) {
    // Will only be triggered on the page load, when it must first wait for $rootScope.businesses to be set
    $rootScope.$on('businessesLoadedInMapbox', loadBusiness);

    // Check if mapbox service has set this flag to true, which means it has finished adding all businesses to mapbox.
    // TODO: Need to find a better way to do this check.
    if ($rootScope.businessesLoadedInMapbox) {
        loadBusiness();
    }

    function loadBusiness() {
        var business = findBusinessInBusinessesList($stateParams.business);
        if (business) {
            $rootScope.pageTitle = business.name;
            console.log($rootScope.pageTitle);
            $rootScope.$emit('openPopupForBusiness', business.id);
        } else {
            alert('404: Business not found!  Redirecting to: ' + $rootScope.currentLocation.city);
            $state.go('location', { location: $rootScope.currentLocation.slug });
        }
    }

    // TODO: Rename this function.  Trying to find if a business has a matching slug inside the business array
    function findBusinessInBusinessesList(businessSlug) {
        for(var i = 0; i < $rootScope.businesses.length; i++) {
            if ($rootScope.businesses[i].slug === businessSlug) {
                return $rootScope.businesses[i];
            }
        }
        return false;
    }


})

;