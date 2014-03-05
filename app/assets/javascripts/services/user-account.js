//= require angular-cookies.min

angular.module('service.user-account', [
    'ngCookies'
])

.service('userAccountService', function($rootScope, $http, $q, $cookieStore) {
    // Keep user object on rootScope, as may need it for bindings in other controllers

    function initUserData() {
        var existingUserData = $cookieStore.get('user');
        if (existingUserData) {
            $rootScope.user = existingUserData;
        } else {
            $rootScope.user = {};
            $rootScope.user.signedIn = false;
        }
        $rootScope.$watch('user', function() {
            $cookieStore.put('user', $rootScope.user);
        }, true);
    }

    function signIn(email, password) {
        var deferred = $q.defer();
        $http({
            method: 'POST',
            url: '/api/users/sign_in',
            data:  {
                user: {
                    email: email,
                    password: password
                }
            }
        })
        .success(function(response) {
            $rootScope.user.signedIn = true;
            $rootScope.user.email = email;
            $rootScope.user.sessionToken = response.auth.token;
            deferred.resolve(response.auth);
        })
        .error(function(response) {
            if (!response) {
                deferred.resolve('server-down');
            } else {
                deferred.resolve(response.auth);
            }
        });

        return deferred.promise;
    }

    function signOut() {
        var deferred = $q.defer();
        $http({
            method: 'DELETE',
            url: '/api/users/sign_out'
        })
            .success(function(response) {
                // Replace old user data with empty object
                $rootScope.user = {};
                deferred.resolve(response.auth);
            })
            .error(function(response) {
                deferred.resolve('Sign out failed.');
            });

        return deferred.promise;
    }

    function register(email, password) {
        var deferred = $q.defer();
        $http({
            method: 'POST',
            url: '/api/users',
            data: {
                user: {
                    email: email,
                    password: password
                }
            }
        })
            .success(function(response) {
                $rootScope.user.signedIn = true;
                $rootScope.user.email = email;
                $rootScope.user.sessionToken = response.auth.token;
                deferred.resolve(response.auth);
            })
            .error(function(response) {
                if (!response) {
                    deferred.resolve('server-down');
                } else {
                    deferred.resolve(response.auth);
                }
            });

        return deferred.promise;
    }

    function isLoggedIn() {
        return $rootScope.user.signedIn;
    }

    return {
        signIn: signIn,
        signOut: signOut,
        register: register,
        initUserData: initUserData,
        isLoggedIn: isLoggedIn
    };
})

;
