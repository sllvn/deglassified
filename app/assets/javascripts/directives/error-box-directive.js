angular.module('directive.error-box', [])

.directive('errorBox', function() {
    return {
        templateUrl: '/partials/error-box-directive.html', 
        scope: true,
        link: function(scope, element, attrs) {
            scope.$watch(attrs.errorBox, function(errors) {
                // If there are any existing errors, clear them, so that the fade in animation will be trigger when re-adding new errors
                scope.errors = false; 
                setTimeout(function() {
                    return function() {
                        scope.errors = errors; 
                        scope.$digest();
                    };
                }(), 1);
            });
        }    
    };
})

;
