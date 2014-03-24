//= require angular-resource.min
angular.module('service.business-data', [
    'service.user-account'
])

.service('businessDataService', function($http, userAccountService) {
    function submit(business) {
        var user = userAccountService.getUser();
        return $http({
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
        });
    }

    return {
        submit: submit
    };

})

;
