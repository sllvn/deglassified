angular.module('state.business', ['ui.router', 'service.mapbox'])

.config(function($stateProvider) {
    $stateProvider.state('location.business', {
        url: '/:business',
        controller: 'businessCtrl'
    });
})

.controller('businessCtrl', function($rootScope, $scope, $state, $stateParams, mapboxService) {
    // If the business param is empty (ie. '/seattle/') redirect to the location, WITHOUT a trailing
    // slash (ie. '/seattle').  Important to cease code to not trigger a 404 page.
    if ($stateParams.business === '') {
        $state.go('location');
        return;
    }

    // Will only be triggered on the page load, when it must first wait for $rootScope.businesses to be set
    $scope.$on('businessesLoadedInMapbox',function() {
        loadBusiness();
    });

    // Check if mapbox service has set this flag to true, which means it has finished adding all businesses to mapbox.
    if ($rootScope.businessesLoadedInMapbox) {
        loadBusiness();
    }

    function loadBusiness() {
        var business = findBusinessByStateParams($stateParams.business);
        if (business) {
            $rootScope.pageTitle = business.name;
            $rootScope.$emit('openPopupForBusiness', business.slug);
            $rootScope.pageTitle = business.name;
        } else {
//            alert('404: Business not found!  Redirecting to: ' + $rootScope.currentLocation.city);
//            $state.go('location', { location: $rootScope.currentLocation.slug });
        }

    }

    // TODO: Rename this function.  Trying to find if a business has a matching slug inside the business array
    function findBusinessByStateParams(businessSlug) {
        for(var i = 0; i < $rootScope.businesses.length; i++) {
            if ($rootScope.businesses[i].slug === businessSlug) {
                return $rootScope.businesses[i];
            }
        }
        return false;
    }


})

;