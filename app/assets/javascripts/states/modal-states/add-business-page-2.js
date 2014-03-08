angular.module('state.add-business.page-2', [
    'ui.router',
    'ngCookies',
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

.controller('addBusinessPage2Ctrl', function($scope, $http, $state, userAccountService, miniMapService, locationDataService, mainModalService) {
    if (isBusinessDataMissing()) {
        // Prompt a message asking to fill required fields
        $state.go('add-business.page-1');
        return;
    }
    
    function isBusinessDataMissing() {
        var business = $scope.business;
        return !business.name || !business.address || !business.location;
    }

    getGeoCoords($scope.business.address)
        .success(function(data) {
            var business = data.results[0];
            setBusinessDetails(business);
            // Replace user-typed address with formatted address.
            var coords = business.location;
            miniMapService.showBusiness(coords, $scope.business);
            $scope.geocodeXHRfinished = true;
        });

    function getGeoCoords(address) {
        return $http({
            method: 'GET',
            url: 'http://api.geocod.io/v1/geocode',
            params: {
                api_key: '40c7637d034f707bd6f5600c536d5c5790f0073',
                q: address
            }
        });
    }

    function setBusinessDetails(business) {
        var coords = business.location;
        $scope.business.formattedAddress = business.formatted_address;
        $scope.business.lat = coords.lat;
        $scope.business.lng = coords.lng;
    }

    $scope.submitBusiness = function() {
        var user = userAccountService.getUser();
        var business = $scope.business;
        $http({
            method: 'POST',
            url: '/api/businesses',
            params: {
                user_email: user.email,
                user_token: user.sessionToken
            },
            data: {
                business: {
                    name: business.name,
                    lat: business.lat,
                    lng: business.lng,
                    address: business.address,
                    location: business.city.text,
                    website: business.website,
                    yelp: business.yelp,
                    facebook: business.facebook,
                    twitter: business.twitter
                }
            }
        })
        .success(function(res) {
            // Business is submitted, so clear saved business details and cookie
            $scope.$parent.clearFormData();
            // Update location cache for the new business
            locationDataService.updateLocationCache(res.location.slug);
            mainModalService.closeModalWithoutRedirect();
            $state.go('location.business', { location: res.location.slug, business: res.slug }, { reload: true });
        })
        .error(function(err, status) {
            console.log(err);
            console.log(status);
        });
    };

    $scope.useFormattedAddress = function() {
        $scope.business.address = $scope.business.formattedAddress;
    };
})
;
