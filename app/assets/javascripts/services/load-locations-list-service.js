angular.module('service.load-locations-list', ['restangular'])

.run(function($rootScope, Restangular) {

    // Stub data, until we have a rest call for api/locations/ return these bare minimum details needed for
    // the navigation.
    $rootScope.locations = [
        {
            city: 'Seattle',
            state: 'WA',
            slug: 'seattle'
        },
        {
            city: 'Las Vegas',
            state: 'NV',
            slug: 'las-vegas'
        }
    ];
})

;