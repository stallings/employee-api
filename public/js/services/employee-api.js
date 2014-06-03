angular.module('employee-api', [])
    .factory('employee', function ($q, Restangular) {

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
                Restangular.setDefaultRequestParams({key: user.token});
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
                    Restangular.setDefaultRequestParams({key: user.token});
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
                Restangular.setDefaultRequestParams({key: user.token});
                setLocalStorage(user.token, user.name, user.level);
                d.resolve();
            }, function() {
                d.reject();
            });
            return d.promise;
        }


        //ADD function setAPIkey(); that's configurable through as a provider

        function directorySearch(employeeTypes, jobTitles) {
            var d = $q.defer();
            var searchObject = {};

            if(employeeTypes.length) {
                searchObject.employeeType = employeeTypes;
            }
            if(jobTitles.length) {
                searchObject.title = jobTitles;
            }
            Restangular.one('users').post('directory', searchObject).then(function(data) {
                d.resolve(data);
            }, function() {
                d.reject();
            });
            return d.promise;
        }

        function getUser(name) {
            var d = $q.defer();

            Restangular.one('users', name).get().then(function(data) {
                d.resolve(data[0]);
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
            },
            directorySearch: function(employeeTypes, jobTitles) {
                return directorySearch(employeeTypes, jobTitles);
            },
            getUser: function(name) {
                return getUser(name);
            }
        };

        return service;
    });

