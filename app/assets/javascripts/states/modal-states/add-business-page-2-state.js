angular.module('state.add-business.page-2', [
    'ui.router',
    'ngCookies',
    'service.mini-map',
    'service.main-modal',
    'service.geocoding'
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

.controller('addBusinessPage2Ctrl', function($scope, $http, $state, userAccountService, miniMapService, locationDataService, mainModalService, geocodingService) {
    if (isBusinessDataMissing()) {
        // Prompt a message asking to fill required fields
        $state.go('add-business.page-1');
        return;
    } else {
        miniMapService.showBusiness($scope.business);
        $scope.geocodeXHRfinished = true;
    }
    
    function isBusinessDataMissing() {
        var business = $scope.business;
        return !business.name || !business.address || !business.location || !business.coords || !business.restriction;
    }

    $scope.submitBusiness = function() {
        var user = userAccountService.getUser();
        var business = $scope.business;
        console.log(business);
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
                    lat: business.coords.lat,
                    lng: business.coords.lng,
                    address: business.address,
                    location: business.location,
                    restriction_type: business.restriction,
                    notes: business.notes,
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
        miniMapService.createNewMarker($scope.business);
    };

    $scope.useFormattedLocation = function() {
        $scope.business.location.text = $scope.business.formattedLocation;
        miniMapService.createNewMarker($scope.business);
    };
})
;
