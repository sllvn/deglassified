//= require angular-cookies.min

angular.module('service.user-account', [
    'ngCookies'
])

.service('userAccountService', function($http, $q, $state, $cookieStore) {
    var existingUserData = $cookieStore.get('user');
    var user = existingUserData ? existingUserData : {};

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
            signInUser(email, response);
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
                user = {};
                deleteUserCookie();
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
                signInUser(email, response);
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

    function signInUser(email, response) {
        user.signedIn = true;
        user.email = email;
        user.sessionToken = response.auth.token;
        updateUserCookie();
    }

    function redirectIfNotSignedIn(stateToRedirect) {
        if (!user.signedIn) {
            $state.go(stateToRedirect);
        }
    }

    function redirectIfSignedIn(stateToRedirect) {
        if (user.signedIn) {
            $state.go(stateToRedirect);
        }
    }

    function updateUserCookie() {
        $cookieStore.put('user', user);
    }

    function deleteUserCookie() {
        $cookieStore.remove('user');
    }

    function getUser() {
        return user;
    }

    return {
        signIn: signIn,
        signOut: signOut,
        register: register,
        getUser: getUser,
        redirectIfNotSignedIn: redirectIfNotSignedIn,
        redirectIfSignedIn: redirectIfSignedIn
    };
})

;
