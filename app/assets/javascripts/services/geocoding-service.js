angular.module('service.geocoding', [])

.service('geocodingService', function($http) {
    var GOOGLE_API_KEY = 'AIzaSyDuXXpaTFWLQ1WVzEsT2MslD0ef4wlDXTw',
        GOOGLE_API_URL = 'https://maps.googleapis.com/maps/api/geocode/json';

    function geocodeAddress(address) {
        return $http({
            method: 'GET',
            url: GOOGLE_API_URL,
            params: {
                key: GOOGLE_API_KEY,
                address: address,
                sensor: false
            }
        });
    }

    function geocodeLocation(location) {
        return $http({
            method: 'GET',
            url: GOOGLE_API_URL,
            params: {
                key: GOOGLE_API_KEY,
                address: location,
                sensor: false
            }
        });
    }

    return {
        geocodeAddress: geocodeAddress,
        geocodeoLocation: geocodeLocation
    };
})

;
