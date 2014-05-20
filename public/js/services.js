// This should handle the current user.  currentUser will decide if we get Login/Logout
// Look at page 224 of ng-book

angular.module('myApp.services', [])

    .factory('Auth', function ($q, Restangular) {

        // Make sure we are using promises
        // http://markdalgleish.com/2013/06/using-promises-in-angularjs-views/
        var baseLogins = Restangular.all('logins');

        // User Model
        var user = {
            validLogin: false
        };

        function setLocalStorage (token, name, level) {
            localStorage.authToken = token;
            localStorage.authName = name;
            localStorage.authLevel = level;
        }

        function deleteLocalStorage() {
            delete localStorage.authToken;
            delete localStorage.authName;
            delete localStorage.authLevel;
        }

        // Check if a token is still valid
        function checkToken() {
            var d = $q.defer();

            // If we already checked token to be valid, return true
            if (user.validLogin) {
                d.resolve();

            // If the user already has a token, check if still valid
            } else if (localStorage.authToken) {
                Restangular.one('logins', localStorage.authToken).get().then(function () {
                    // If valid token, fill in the user model
                    user = {
                        token: localStorage.authToken,
                        name: localStorage.authName,
                        level: localStorage.authLevel,
                        validLogin: true
                    };
                    d.resolve();
                }, function () {
                    // If not valid, empty user model
                    user = {
                        validLogin: false
                    };
                    deleteLocalStorage();
                    d.reject();
                });

            // Else user has not logged in
            } else {
                d.reject();
            }
            return d.promise;
        }

        // Check a login
        function checkLogin(username, password) {
            var d = $q.defer();

            Restangular.one('logins').post('', { username: username, password: password }).then(function(data) {
                user = {
                    token: data.key,
                    name: data.self,
                    level: data.level,
                    validLogin: true
                };
                setLocalStorage(user.token, user.name, user.level);
                d.resolve();
            }, function() {
                d.reject();
            });
            return d.promise;
        }

        var service = {
            isAuthorized: function (level) {
                return user.level >= level;
            },
            login: function(username, password) {
                return checkLogin(username, password);
            },
            isLoggedIn: function () {
                return checkToken();
            },
            getToken: function () {
                return user.token;
            },
            getName: function () {
                return user.name;
            },
            getLevel: function () {
                return user.level;
            },
            logout: function () {
                user = {
                    validLogin: false
                };
                setLocalStorage('', '', '');
            }
        };

        return service;
    });

