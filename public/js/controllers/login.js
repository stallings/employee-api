myApp.controller('LoginController', function($scope, authentication) {

    // Login
//    authentication.login("jpulgar", "password").then(function() {
//        console.log('login successful');
//    }, function() {
//        console.log('login failed');
//    });

    authentication.isLoggedIn().then(function() {
        $scope.isLoggedIn = true;
        console.log(authentication.getName());
    }, function() {
        $scope.isLoggedIn = false;
    });

});