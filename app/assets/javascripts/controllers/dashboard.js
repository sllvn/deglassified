angular.module('controller.dashboard', ['service.mini-map']) 
.controller('dashboardCtrl', function($scope, $http, $q, miniMapService) {
    // Always init map on load
    miniMapService.initMap();
    
    $scope.business = {};
    // Stub data
    $scope.business.address = '1311 12th ave so 98144';
    $scope.business.name = 'Deglassified Inc.';

    $scope.findLocation = function() {
        getGeoCoords($scope.business.address)
            .then(function(coords) {
                setCoordsOnScope(coords);
                miniMapService.showBusiness(coords, $scope.business);
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
            var coords = data.results[0].location;
            deferred.resolve(coords);
        });
        return deferred.promise;
    }

    function setCoordsOnScope(coords) {
        $scope.business.latitude = coords.lat;
        $scope.business.longitude = coords.lng;
    }

    function focusAddressField() {
        console.log('hi');
        document.getElementById('address').focus();
    }
})

;
