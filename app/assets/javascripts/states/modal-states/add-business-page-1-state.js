angular.module('state.add-business.page-1', [
    'ui.router',
    'ui.select2',
    'service.location-data',
    'service.geocoding',
    'angularErrorBox'
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
    // If links object does not already exist
    if (!$scope.business.links) {
        $scope.business.links = {};
    }
    var progressButton = Ladda.create(document.querySelector('.submit-button'));

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
                var locations = data.locations.map(formatLocations);
                return { results: locations }; 
            }
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

    function formatLocations(location) {
        return { id: location.city, text: location.city };
    }

    $('#location-select').on('select2-selecting', function(choice) {
        // Do the manual binding here, so that we can just bind a string to business.location, instead of the default select2 object
        $scope.business.location = choice.val;
        verifyLocation($scope.business.location);
    });

    function verifyLocation(location) {
        geocodingService.geocode(location)
            .success(function(response) {
                if (response.status == 'ZERO_RESULTS') {
                    $scope.locationErrors = ['"' + location + '"' + ' could not be found. Please enter a new location.'].slice();
                    $scope.business.location = null;
                    $scope.select2LocationModel = '';
                } else if (response.status == 'OK') {
                    $scope.business.formattedLocation = response.result.city;
                }
            })
            .error(function(response) {
                $scope.locationErrors = ['Unable to connect to the server. Please check your connection and try again'].slice();
            });
    }

    $scope.verifyBusinessAndLocation = function() {
        progressButton.start();
        verifyAddress();
    };

    function verifyAddress() {
        var address = $scope.business.address;
        geocodingService.geocode(address)
            .success(function(response) {
                if (response.status == 'ZERO_RESULTS') {
                    $scope.addressErrors = ['"' + address + '"' + ' could not be found. Please enter a new address.'].slice();
                } else if (response.status == 'OK') {
                    $scope.business.formattedAddress = response.result.formatted_address;
                    $scope.business.coords = response.result.coords;
                    $state.go('add-business.page-2');
                }
            })
            .error(function(response) {
                $scope.addressErrors = ['Unable to connect to the server. Please check your connection and try again'].slice();
            })
            .then(function() {
                progressButton.stop();
            });
    }

})

;
