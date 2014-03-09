angular.module('service.geocoding', [])

.service('geocodingService', function($http) {
    var GEOCODE_API_URL = '/api/geocode';

    function geocode(address) {
        return $http({
            method: 'GET',
            url: GEOCODE_API_URL,
            params: {
                address: address
            }
        });
    }

    return {
        geocode: geocode
    };
})

;
