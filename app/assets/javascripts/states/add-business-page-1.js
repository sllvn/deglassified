angular.module('state.add-business.page-1', [
    'ui.router',
    'ui.select2'
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

.controller('addBusinessPage1Ctrl', function($scope, $state) {
    $scope.nextPage = function() {
        $state.go('add-business.page-2');
    };

    $scope.select2Options = {
        ajax: {
            dataType: 'json',
            url: '/api/locations/',
            results: function(data) {
                var locations = data.locations.map(function(location) {
                    return { id: location.city, text: location.city };
                });
                return { results: locations }; 
            },
        }
    };

})

;
