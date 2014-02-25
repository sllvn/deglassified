angular.module('controller.dashboard', ['service.mini-map'])

.controller('dashboardCtrl', function($scope, $http, $q, miniMapService) {
    $scope.business = {};

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

})

;
