angular.module('state.business', ['ui.router', 'service.mapbox'])

.config(function($stateProvider) {
    $stateProvider.state('location.business', {
        url: '/:business',
        controller: 'businessCtrl'
    })
})

.controller('businessCtrl', function($rootScope, $stateParams, mapboxService) {
    $rootScope.$on('businessesDone', function() {
        console.log('test');
        var businessIndex;
        for(var i = 0; i < $rootScope.businesses.length; i++) {
            if ($rootScope.businesses[i].url_slug === $stateParams.business) {
                businessIndex = $rootScope.businesses[i];
                break;
            }
        }
        if (businessIndex) {
            $rootScope.pageTitle = businessIndex.name;
            mapboxService.openPopupForId(businessIndex.id);
        }
    });

})

;