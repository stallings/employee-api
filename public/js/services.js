// This should handle the current user.  currentUser will decide if we get Login/Logout
// Look at page 224 of ng-book

// CHANGE TO USE LOCAL STORAGE
// https://developer.mozilla.org/en-US/docs/Web/Guide/API/DOM/Storage

angular.module('myApp.services', [])

    .factory('Auth', function ($cookies) {

        // This should check in local storage for value
        // Do a Restangular call to the API to make sure the key is still valid
        // Make sure we are using promises


        $cookies.user = '';
        var _user = $cookies.user;
        var setUser = function (user) {
            _user = user;
            $cookies.user = _user;
        }
        return {
            isAuthorized: function (lvl) {
                return _user.role >= lvl;
            },
            setUser: setUser,
            isLoggedIn: function () {
                return _user ? true : false;
            },
            getUser: function () {
                return _user;
            },
            getId: function () {
                return _user ? _user._id : null;
            },
            getToken: function () {
                return _user ? _user.token : '';
            },
            logout: function () {
                $cookies.user = '';
                _user = null;
            }
        }
    });

