// This controller should use services to fill in the information
myApp.controller('LoginController', function($scope, Auth) {
    // Always make scope objects so they are referenced, not copied
    $scope.customer = { name: "Scarlett" };

     // Login
//    Auth.login("jpulgar", "password").then(function() {
//        console.log('login successful');
//    }, function() {
//        console.log('login failed');
//    });

    Auth.isLoggedIn().then(function() {
        $scope.isLoggedIn = true;
    }, function() {
        $scope.isLoggedIn = false;
    }).then(function() {
        console.log(Auth.getName());
    });

});

myApp.controller('HomeController', function($scope) {
});

myApp.controller('SearchController', function($scope) {
});

myApp.controller('DirectoryController', function($scope) {

    $scope.roles = [
        'guest',
        'user',
        'customer',
        'admin'
    ];

    $scope.FEDS = [
        'manager',
        'web dev 1',
        'web dev 2',
        'web dev 3'
    ]

    $scope.PJMS = [
        'associate pjm',
        'senior pjm'
    ]

    $scope.user = {
        roles: []
    };




});

myApp.controller('OrgChartController', function($scope) {
});

myApp.controller('UserController', function($scope, $routeParams) {
    // Always make scope objects so they are referenced, not copied
    $scope.customer = { name: "Scarlett" };
    console.log($routeParams);
});

myApp.controller('AddUserController', function($scope) {
});

