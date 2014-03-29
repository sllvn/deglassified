angular.module('state.business', ['ui.router', 'service.main-map'])

.config(function($stateProvider) {
    $stateProvider.state('location.business', {
        url: '/:business',
        controller: 'businessStateCtrl',
        onEnter: function($stateParams, $state) {
            // If the business param is empty (ie. '/seattle/') redirect to the 
            // location, WITHOUT a trailing slash (ie. '/seattle').  
            if ($stateParams.business === '') {
                $state.go('location', { location: $stateParams.location });
            }
        }
    });
})

.controller('businessStateCtrl', function($rootScope, $scope, $state, $stateParams, mainMapService) {
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
            mainMapService.openBusinessPopup(business.slug);
        } else {
            $state.go('404');
        }
    }

    // Find if slug matches existing business
    function findBusinessByStateParams(businessSlug) {
        // Get a list of businesses that should have been added to scope by parent
        // /:location state
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
