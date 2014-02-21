//= require angular-cookies

angular.module('service.user-account', [
    'ngCookies'
])

.service('userAccountService', function($http, $q, $cookieStore) {
    var testUser = {
        user: {
            email: 'someone@example.com',
            password: 'somepassword'
        }
    };

    function signIn(email, password) {
        var deferred = $q.defer();

        var loginDetails = {
            user: {
                email: email,
                password: password
            }
        };

        $http({
            method: 'POST',
            url: '/api/users/sign_in',
            data: loginDetails
//            data: testUser
        })
        .success(function(response) {
            $cookieStore.put('user', {
                sessionToken: response.auth.token
            });
            deferred.resolve(response.auth.status);
        })
        .error(function(response) {
            if (!response) {
                deferred.resolve('server-down');
            } else {
                deferred.resolve(response.auth.status);
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

    return {
        signIn: signIn,
        signOut: signOut
    }
})

;