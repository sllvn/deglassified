describe('Business State Controller', function() {
    var scope, 
        state,
        stateParams,
        mainMapServiceMock,
        createController;

    beforeEach(function() {
        $injector = angular.injector(['ngMock', 'state.business']);
        state = $injector.get('$state');
        scope = $injector.get('$rootScope').$new();
        stateParams = $injector.get('$stateParams');

        scope.businesses = [
            {
                name: 'mock business',
                slug: 'mock-business'
            } 
        ];

        mainMapServiceMock = jasmine.createSpyObj('mainMapService', ['openBusinessPopup']);

        /* Defaults unless overwritten */
        scope.mapboxMarkersLoaded = true;
        stateParams.business = 'mock-business';

        var $controller = $injector.get('$controller');
    
        createController = function() {
            return $controller('businessStateCtrl', {
                $scope: scope,
                $stateParams: stateParams,
                $state: state,
                mainMapService: mainMapServiceMock
            });
        };
    });

    it('should immediately load the business if mapbox markers are already loaded', function() {
        createController();
        // Expect that the pageTitle was changed to match the loaded business
        expect(scope.pageTitle).toBe(scope.businesses[0].name);
    });

    it('should load the business once mapbox markers are finally loaded', function() {
        // Mapbox markers are not initially loaded
        scope.mapboxMarkersLoaded = false;
        createController();
        // Expect that the pageTitle has not yet be set
        expect(scope.pageTitle).toBeFalsy();
        // Mapbox markers are loaded, so emit event
        scope.$broadcast('mapboxMarkersLoaded');
        // Trigger event has been emitted, so business should be loaded now
        expect(scope.pageTitle).toBe(scope.businesses[0].name);
    });

    describe('once mapbox markers are loaded', function() {
    
        it('should change the pageTitle and open the popup if the business exists', function() {
            createController();
            // Expect that the pageTitle was not changed to match the loaded business
            expect(scope.pageTitle).toBe(scope.businesses[0].name);
            expect(mainMapServiceMock.openBusinessPopup).toHaveBeenCalledWith(stateParams.business);
        });

        it('should go to state "404" if the business does not exist', function() {
            spyOn(state, 'go');
            stateParams.business = 'non-existent-business';
            createController();
            // Expect that the pageTitle was not changed to match the loaded business
            expect(scope.pageTitle).toBeFalsy();
            expect(state.go).toHaveBeenCalledWith('404');
        });
    
    });

});
