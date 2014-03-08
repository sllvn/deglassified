angular.module('state.add-business.page-1', [
    'ui.router',
    'ui.select2',
    'service.location-data'
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

.controller('addBusinessPage1Ctrl', function($scope, $state, locationDataService) {
    $scope.nextPage = function() {
        $state.go('add-business.page-2');
    };

    locationDataService.getList()
        .then(function(response) {
            var formattedLocations = response.map(formatLocations);

            $('#select-location').select2({
                data: formattedLocations,
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
            });

            // ng-model does not play well with select2 inputs, so implement our own model binding
            $('#select-location').change(function(data) {
                $scope.business.city = {};
                $scope.business.city.text = data.val;
                $scope.$digest();
           });
           $('#select-location').val('test');
        });

    function formatLocations(location) {
        return { id: location.city, text: location.city };
    }
})

;
