angular.module('controller.dashboard', [])

.controller('dashboardCtrl', function($scope, $http) {
    $scope.business = {};

    $scope.findLocation = function() {
        getGeoCoords($scope.business.address);
        //loadMinimap();
    };

    function loadMinimap() {
        var mapElement = 'minimap',
            defaultView = [47.603569, -122.329453],
            defaultZoom = 12,
            map = L.mapbox.map(mapElement, 'licyeus.gg3718oi').setView(defaultView, defaultZoom);

        var geoJSON = {
            type: 'FeatureCollection',
            features: []
        };

        var markerLayer = L.mapbox.markerLayer();
    }

    function getGeoCoords(address) {
        console.log(address);
        $http({
            method: 'GET',
            url: 'http://api.geocod.io/v1/geocode',
            params: {
                api_key: '667915937c113a907395335035a501656590a79',
                q: ["42370 Bob Hope Drive, Rancho Mirage CA", "1290 Northbrook Court Mall, Northbrook IL", "4410 S Highway 17 92, Casselberry FL", "15000 NE 24th Street, Redmond WA", "17015 Walnut Grove Drive, Morgan Hill CA"]
            }
        })
        .success(function(err, response) {
            console.log(response);
        });
    }
})

;
