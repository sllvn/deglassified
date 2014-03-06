angular.module('state.add-business.page-2', [
    'ui.router',
    'service.mini-map',
    'service.main-modal'
]) 

.config(function($stateProvider) {
    $stateProvider.state('add-business.page-2', {
        url: '/mark-location',
        views: {
            'addBusiness': {
                templateUrl: '/partials/add-business-page-2.html',
                controller: 'addBusinessPage2Ctrl'
            }
        },
        onEnter: function($rootScope) {
            $rootScope.pageTitle = 'Mark Location - Add Business';
        }
    }); 
})

.controller('addBusinessPage2Ctrl', function($scope, $http, $q, $state, userAccountService, miniMapService, locationDataService, mainModalService) {

    getGeoCoords($scope.business.address)
        .then(function(response) {
            // Replace user-typed address with formatted address.
            $scope.business.address = response.formatted_address;
            var coords = response.location;
            miniMapService.initMap(coords);
            miniMapService.showBusiness(coords, $scope.business);
        });

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
            // Wait for the modal to finish closing before changing state
            setTimeout(function() {
                // Open the newly added business on the main map
                $state.go('location.business', { location: business.locationSlug, business: res.business.slug }, { reload: true });
            }, 1000);
        })
        .error(function(err, status) {
            console.log(err);
            console.log(status);
        });
    };

})
;
