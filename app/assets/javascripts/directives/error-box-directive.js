angular.module('directive.error-box', [])

.directive('errorBox', function() {
    return {
        templateUrl: '/partials/error-box-directive.html', 
        scope: true,
        transclude: true,
        link: function(scope, element, attrs) {
            scope.classes = 'animate-fade';
            scope.$watch(attrs.errorBox, function(errors) {
                // If attrs.errorBox is a string, wrap it in an array
                if (typeof errors === 'string') {
                    errors = [errors];
                }
                // Clear the error model to retrigger animation for the ng-if
                if (scope.errors) {
                    scope.errors = null; 
                }
                setTimeout(function() {
                    return function() {
                        scope.errors = errors; 
                        scope.$digest();
                    };
                }(), 50);

                if (attrs.timer) {
                    setTimeout(function() {
                        scope.errors = false;
                        scope.$digest();
                    }, +attrs.timer);
                }
            });
        }    
    };
})

;
