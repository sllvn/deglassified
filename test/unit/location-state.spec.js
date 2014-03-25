describe('Location State Controller', function() {
    var scope, 
        state,
        deferred,
        locationDataServiceMock,
        mainMapServiceMock,
        createController;

    beforeEach(function() {
        var $injector = angular.injector(['ngMock', 'state.location']);
        var q = $injector.get('$q');
        state = $injector.get('$state');
        scope = $injector.get('$rootScope').$new();

        locationDataServiceMock = {
            getSingle: function() {
                deferred = q.defer();
                return deferred.promise;
            }
        };

        mainMapServiceMock = jasmine.createSpyObj('mainMapService', ['loadLocation']);

        var $controller = $injector.get('$controller');
    
        createController = function() {
            return $controller('locationStateCtrl', {
                $scope: scope,
                $state: state,
                locationDataService: locationDataServiceMock,
                mainMapService: mainMapServiceMock
            });
        };
    });

    it('should get location data, on controller load', function() {
        spyOn(locationDataServiceMock, 'getSingle').andCallThrough();
        createController();
        expect(locationDataServiceMock.getSingle).toHaveBeenCalled();
    });

    it('should change state to "404" if location data call returns 404', function() {
        spyOn(state, 'go');
        createController();
        scope.$apply(deferred.resolve(404));
        // Expect state.go('404')
        expect(state.go).toHaveBeenCalledWith('404');
    });

    it('should update scope data if location data call returns a valid location', function() {
        createController();
        var mockLocation = {
            slug: 'mock-city',
            city: 'mock city',
            businesses: ['mock1', 'mock2']
        };
        scope.$apply(deferred.resolve(mockLocation));
        expect(scope.pageTitle).toBe(mockLocation.city);
        expect(scope.currentCity).toBe(mockLocation.city);
        expect(scope.businesses).toBe(mockLocation.businesses);
    });

    it('should call mainMapService.loadLocation() if the location data is valid', function() {
        createController();
        var mockLocation = {
            slug: 'mock-city',
            city: 'mock city',
            businesses: ['mock1', 'mock2']
        };
        scope.$apply(deferred.resolve(mockLocation));
        expect(mainMapServiceMock.loadLocation).toHaveBeenCalledWith(mockLocation);
    });
});
