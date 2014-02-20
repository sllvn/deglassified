angular.module('service.user-account', [
    'LocalStorageModule'
])

.service('userAccountService', function($http, $q, localStorageService) {
    var user = {};

    var testUser = {
        "user": {
            "email": "someone@example.com",
            "password": "somepassword"
        }
    };

    function signIn() {
        var deferred = $q.defer();
        $http({
            method: 'POST',
            url: '/api/users/sign_in',
            data: testUser
        })
        .success(function(response) {
            user.sessionToken = response.auth.token;
            // Find out if this automatically overwrites
            localStorageService.add('user', user);
            deferred.resolve(response.auth);
        })
        .error(function(response) {
            console.log(response.auth);
            deferred.resolve('Sign in failed.');
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
                localStorageService.remove('user');
                deferred.resolve(response.auth);
            })
            .error(function(response) {
                console.log(response.auth);
                deferred.resolve('Sign out failed.');
            });

        return deferred.promise;
    }

    return {
        signIn: signIn,
        signOut: signOut
    }
})

;