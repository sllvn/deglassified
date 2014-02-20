angular.module('service.user-account', [

])

.service('userAccountService', function($http, $q) {
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
            deferred.resolve(response);
        })
        .error(function(response) {
            console.log(response);
            deferred.resolve('Sign in failed.');
        });

        return deferred.promise;
    }

    function signOut() {
        var deferred = $q.defer();
        $http({
            method: 'POST',
            url: '/api/users/sign_in',
            data: testUser
        })
            .success(function(response) {
                deferred.resolve(response);
            })
            .error(function(response) {
                console.log(response);
                deferred.resolve('Sign in failed.');
            });

        return deferred.promise;
    }

    return {
        signIn: signIn,
        signOut: signOut
    }
})

;