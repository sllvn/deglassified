describe('LocationDataService', function() {
    var scope, 
        state, $httpBackend,
        deferred,
        locationDataService,
        mockParam,
        mockResponse;

    beforeEach(function() {
        var $injector = angular.injector(['ngMock', 'service.location-data']);
        var q = $injector.get('$q');
        scope = $injector.get('$rootScope').$new();
        $httpBackend = $injector.get('$httpBackend');

        locationDataService = $injector.get('locationDataService');
        mockParam = 'mock-param';

        mockResponse = {
            location: {
                slug: 'mock-slug'
            }
        };
    });

    afterEach(function() {
        $httpBackend.verifyNoOutstandingExpectation();
        $httpBackend.verifyNoOutstandingRequest();
    });
    
    it('should have a public method to return a single location', function() {
        $httpBackend.expectGET('/api/locations/' + mockParam).respond(200, mockResponse);

        var response;
        locationDataService.getSingle(mockParam)
            .then(function(res) {
                response = res;
            });
        expect(response).toBeFalsy();
        $httpBackend.flush();
        expect(response).toEqual(mockResponse.location);
    });

    it('should have a public method to return a list of all the location', function() {
        var mockList = {
            locations: ['mock']
        };
        $httpBackend.expectGET('/api/locations/').respond(200, mockList);

        var response;
        locationDataService.getList()
            .then(function(res) {
                response = res;
            });
        expect(response).toBeFalsy();
        $httpBackend.flush();
        expect(response).toEqual(mockList.locations);
    });

    it('should cache responses', function() {
        var firstResponse, secondResponse;
        $httpBackend.expectGET('/api/locations/' + mockParam).respond(200, mockResponse);
        // The first call should make a GET request, and cache the response
        locationDataService.getSingle(mockParam)
            .then(function(res) {
                firstResponse = res;
            });
        $httpBackend.flush();
        // The second call should not make a GET request, but simply resolve the cached
        // value
        locationDataService.getSingle(mockParam)
            .then(function(res) {
                secondResponse = res;
                expect(firstResponse.slug).toEqual(secondResponse.slug);
            });
    });

    it('should have a public method to update the cache for a location', function() {
        var firstResponse, secondResponse, thirdResponse;
        $httpBackend.expectGET('/api/locations/' + mockParam).respond(200, mockResponse);
        // The first call should make a GET request, and cache the response
        locationDataService.getSingle(mockParam)
            .then(function(res) {
                firstResponse = res;
            });
        $httpBackend.flush();
        // The second call should not make a GET request, but simply resolve the cached
        // value
        locationDataService.getSingle(mockParam)
            .then(function(res) {
                secondResponse = res;
                expect(firstResponse.slug).toEqual(secondResponse.slug);
            });

        $httpBackend.expectGET('/api/locations/' + mockParam).respond(200, mockResponse);
        // This should delete the existing cache, and fire off a fresh GET
        //
        locationDataService.updateLocationCache(mockParam);
        $httpBackend.flush();
    });
});
