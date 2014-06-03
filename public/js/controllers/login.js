myApp.controller('LoginController', function($scope, employee) {

    // Login
//    employee.login("jpulgar", "password").then(function() {
//        console.log('login successful');
//    }, function() {
//        console.log('login failed');
//    });

    employee.isLoggedIn().then(function() {
        $scope.isLoggedIn = true;
        $scope.fullname = employee.getName();
    }, function() {
        $scope.isLoggedIn = false;
    });

});