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

    if ($scope.mapboxMarkersLoaded) {
        loadBusiness();
    } else {
        // mapboxMarkers not loaded yet.  Listen to when it is.
        $scope.$on('mapboxMarkersLoaded',function() {
            loadBusiness();
        });
    }

    function loadBusiness() {
        var business = findBusinessByStateParams($stateParams.business);
        if (business) {
            $rootScope.pageTitle = business.name;
            mapboxService.openBusinessPopup(business.slug);
//            $rootScope.pageTitle = business.name;
        } else {
//            alert('404: Business not found!  Redirecting to: ' + $rootScope.currentLocation.city);
//            $state.go('location', { location: $rootScope.currentLocation.slug });
        }
    }

    // TODO: Rename this function.  Trying to find if a business has a matching slug inside the business array
    function findBusinessByStateParams(businessSlug) {
        var businesses = $scope.businesses;
        for(var i = 0; i < businesses.length; i++) {
            if (businesses[i].slug === businessSlug) {
                return businesses[i];
            }
        }
        return false;
    }

})

;
