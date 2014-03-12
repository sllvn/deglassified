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
        verifyLocation(choice.val);
    });

    function verifyLocation(location) {
        geocodingService.geocode(location)
            .success(function(response) {
                if (response.status == 'ZERO_RESULTS') {
                    $scope.business.location = null;
                    $('#location-select').val('bad location');
                } else if (response.status == 'OK') {
                    $scope.business.formattedLocation = response.result.city;
                }
            })
            .error(function(response) {
                console.log(response); 
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
                    console.log('tell user bad location!');
                } else if (response.status == 'OK') {
                    $scope.business.formattedAddress = response.result.formatted_address;
                    $scope.business.coords = response.result.coords;
                    $state.go('add-business.page-2');
                }
            })
            .error(function(response) {
                console.log(response); 
            })
            .then(function() {
                progressButton.stop();
            });
    }

})

;
