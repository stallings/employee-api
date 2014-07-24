myApp.controller('LoginController', function($location,$scope, employee, myCache) {

    // Login
   employee.login("jpulgar", "password").then(function() {
       console.log('login successful');
   }, function() {
       console.log('login failed');
   });

    $scope.resetSearch = function() {
        myCache.remove('search');
        myCache.remove('searchResults');
    }

    $scope.resetDirectory = function() {
        myCache.remove('directory');
        myCache.remove('directoryResults');
    }

    employee.isLoggedIn().then(function() {
        $scope.isLoggedIn = true;
        $scope.fullname = employee.getName();
    }, function() {
        $scope.isLoggedIn = false;
    });
});