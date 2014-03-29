//= require angular-resource.min
angular.module('service.business-data', [
    'service.user-account'
])

.service('businessDataService', function($http, userAccountService) {
    function submit(business) {
        var businessData = {
            name: business.name,
            lat: business.coords.lat,
            lng: business.coords.lng,
            address: business.address,
            location: business.location,
            restriction_type: business.restriction_type,
            notes: business.notes
        };
        // Move this logic into the REST backend
        if (business.links.website) {
            businessData.website = business.links.website;
        }
        if (business.links.yelp) {
            businessData.yelp = business.links.yelp;
        }
        if (business.links.facebook) {
            businessData.facebook = business.links.facebook;
        }
        if (business.links.twitter) {
            businessData.twitter = business.links.twitter;
        }
        var user = userAccountService.getUser();
        return $http({
            method: 'POST',
            url: '/api/businesses',
            params: {
                user_email: user.email,
                user_token: user.sessionToken
            },
            data: {
                business: businessData
            }
        });
    }

    return {
        submit: submit
    };

})

;
