//= require angular-cookies

angular.module('service.user-account', [
    'ngCookies'
])

.service('userAccountService', function($http, $q, $cookieStore) {
    var user = {};

    var testUser = {
        user: {
            email: 'someone@example.com',
            password: 'somepassword'
        }
    };

    function signIn(loginDetails) {
        console.log(loginDetails);
        var deferred = $q.defer();
        $http({
            method: 'POST',
            url: '/api/users/sign_in',
            data: testUser
//            data: loginDetails
        })
        .success(function(response) {
            // Find out if this automatically overwrites
            $cookieStore.put('user', {
                sessionToken: response.auth.token
            });
            deferred.resolve(response.auth);
        })
        .error(function(response) {
            deferred.resolve('error');
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

    return {
        signIn: signIn,
        signOut: signOut
    }
})

;