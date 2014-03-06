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

    var formattedCities = $scope.locations.map(function(location) {
        return { id: location.city, text: location.city };
    });
    $scope.select2Options = {
        data: formattedCities,
        createSearchChoice: function (term, data) {
            if ($(data).filter(function () {
                return this.text.localeCompare(term) === 0;
            }).length === 0) {
                return {
                    id: term,
                    text: term
                };
            }
        }
    };

})

;
