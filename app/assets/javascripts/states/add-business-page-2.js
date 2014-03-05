angular.module('state.add-business.page-2', [
    'ui.router',
    'service.user-account',
    'service.mini-map',
    'service.main-modal'
]) 

.config(function($stateProvider) {
    $stateProvider.state('add-business.page-2', {
        url: '/mark-location',
        views: {
            'addBusiness': {
                templateUrl: '/partials/add-business-page-2.html',
                controller: 'addBusinessPage1Ctrl'
            }
        },
        onEnter: function($rootScope) {
            $rootScope.pageTitle = 'Mark Location - Add Business';
        }
    }); 
})

.controller('addBusinessPage2Ctrl', function($scope, $http, $q, $state, userAccountService, miniMapService, locationDataService, mainModalService) {
    // Always init map on load
    miniMapService.initMap();
    
    $scope.business = {};
    // Stub data
    $scope.business.address = '1311 12th avenue south, Seattle, WA 98144';
    $scope.business.name = 'Deglassified Inc.';

    $scope.userEmail = userAccountService.getUser().email;

    $scope.findLocation = function() {
        getGeoCoords($scope.business.address)
            .then(function(response) {
                // Replace user-typed address with formatted address.
                $scope.business.address = response.formatted_address;
                var coords = response.location;
                setCoordsOnScope(coords);
                miniMapService.showBusiness(coords, $scope.business);
                $scope.displaySubmitMapButtons = true;
            });
    };

    function getGeoCoords(address) {
        var deferred = $q.defer();
        $http({
            method: 'GET',
            url: 'http://api.geocod.io/v1/geocode',
            params: {
                api_key: '40c7637d034f707bd6f5600c536d5c5790f0073',
                q: address
            }
        })
        .success(function(data, response) {
            deferred.resolve(data.results[0]);
        });
        return deferred.promise;
    }

    function setCoordsOnScope(coords) {
        $scope.business.lat = coords.lat;
        $scope.business.lng = coords.lng;
    }

    $scope.focusAddressField = function() {
        document.getElementById('address').focus();
        $scope.displaySubmitMapButtons = false;
    };

    $scope.submitBusiness = function() {
        var user = userAccountService.getUser();
        var business = $scope.business;
        $http({
            method: 'POST',
            url: '/api/locations/' + business.locationSlug + '/businesses',
            params: {
                user_email: user.email,
                user_token: user.sessionToken
            },
            data: {
                name: business.name,
                lat: business.lat,
                lng: business.lng,
                address: business.address
            }
        })
        .success(function(res) {
            // Update location cache for the new business
            locationDataService.updateLocationCache(business.locationSlug);
            mainModalService.closeModal();
            // Open the newly added business on the main map
            $state.go('location.business', { location: business.locationSlug, business: res.business.slug }, { reload: true });
        })
        .error(function(err, status) {
            console.log(err);
            console.log(status);
        });
    };

})
;
