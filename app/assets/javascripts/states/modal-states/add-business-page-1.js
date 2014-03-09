angular.module('state.add-business.page-1', [
    'ui.router',
    'ui.select2',
    'service.location-data',
    'service.geocoding'
]) 

.config(function($stateProvider) {
    $stateProvider.state('add-business.page-1', {
        url: '/basic-information',
        views: {
            'addBusiness': {
                templateUrl: '/partials/add-business-page-1.html',
                controller: 'addBusinessPage1Ctrl'
            }
        },
        onEnter: function($rootScope) {
            $rootScope.pageTitle = 'Basic Information - Add Business';
        }
    }); 
})

.controller('addBusinessPage1Ctrl', function($scope, $state, locationDataService, geocodingService) {
    $scope.nextPage = function() {
        $state.go('add-business.page-2');
    };

    $scope.select2Options = {
        ajax: {
            dataType: 'json',
            url: '/api/locations/',
            data: function(term) {
                return {
                    search: term
                };
            },
            results: function(data) {
                var locations = data.locations.map(function(location) {
                    return { id: location.city, text: location.city };
                });
                return { results: locations }; 
            },
        },
        createSearchChoice: function (term, data) {
            if ($(data).filter(function () {
                return this.text.localeCompare(term) === 0;
            }).length === 0) {
                return {
                    id: term,
                    text: term
                };
            }
        }
    };

    $scope.verifyBusinessAndLocation = function() {
        var location = $scope.business.location.id;
        console.log(location);
        geocodingService.geocodeAddress(location)
            .success(function(response) {
                console.log(response);
                if (response.status == 'ZERO_RESULTS') {
                    console.log('tell user bad location!');
                } else if (response.status == 'OK') {
                    var location = response.results[0].formatted_address;
                    //$scope.business.formattedAddress =
                }
            });
    };

    function formatLocations(location) {
        return { id: location.city, text: location.city };
    }
})

;
