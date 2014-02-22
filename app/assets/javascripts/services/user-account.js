//= require angular-cookies.min

angular.module('service.user-account', [
    'ngCookies'
])

.service('userAccountService', function($rootScope, $http, $q, $cookieStore) {
    $rootScope.user = {};
    $rootScope.user.signedIn = false;

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
            $cookieStore.put('user', {
                sessionToken: response.auth.token
            });
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
                $cookieStore.remove('user');
                deferred.resolve(response.auth);
            })
            .error(function(response) {
                console.log(response.auth);
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
                $cookieStore.put('user', {
                    sessionToken: response.auth.token
                });
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

    return {
        signIn: signIn,
        signOut: signOut,
        register: register
    }
})

;