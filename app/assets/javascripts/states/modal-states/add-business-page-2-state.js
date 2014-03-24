angular.module('state.add-business.page-2', [
    'ui.router',
    'ngCookies',
    'service.mini-map',
    'service.main-modal',
    'service.geocoding',
    'service.business-data'
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

.controller('addBusinessPage2Ctrl', function($scope, $http, $state, miniMapService, locationDataService, mainModalService, geocodingService, businessDataService) {
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
        return !business.name || !business.address || !business.location ||
            !business.coords || !business.restriction;
    }

    $scope.submitBusiness = function() {
        businessDataService.submit($scope.business)
            .success(function(response) {
                // Business is submitted, so clear saved business details and cookie
                $scope.$parent.clearFormData();
                // Update location cache for the new business
                locationDataService.updateLocationCache(response.location.slug);
                // Close the modal
                mainModalService.closeModalWithoutRedirect();
                // Go to the newly added business/location
                $state.go('location.business',
                    {
                        location: response.location.slug,
                        business: response.slug
                    },
                    {
                        reload: true
                    }
                );
            })
            .error(function(err, status) {
                $scope.submitErrors = [
                    'Unable to connect to the server. Please check your connection and try again'
                ].slice();
            });
    };

    $scope.useFormattedAddress = function() {
        $scope.business.address = $scope.business.formattedAddress;
        miniMapService.createNewMarker($scope.business);
    };

    $scope.useFormattedLocation = function() {
        $scope.business.location = $scope.business.formattedLocation;
        miniMapService.createNewMarker($scope.business);
    };
})

;
