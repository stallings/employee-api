// This controller should use services to fill in the information
myApp.controller('LoginController', function($scope, authentication) {
    // Always make scope objects so they are referenced, not copied
    $scope.customer = { name: "Scarlett" };

     // Login
//    Auth.login("jpulgar", "password").then(function() {
//        console.log('login successful');
//    }, function() {
//        console.log('login failed');
//    });

    authentication.isLoggedIn().then(function() {
        $scope.isLoggedIn = true;
    }, function() {
        $scope.isLoggedIn = false;
    }).then(function() {
        console.log(authentication.getName());
    });

});

myApp.controller('HomeController', function($scope) {
});

myApp.controller('SearchController', function($scope) {
});

myApp.controller('DirectoryController', function($scope, employee) {

    // JavaScript objects are either copy by value or copy by reference.
    // String, Number, and Boolean are copy by value.
    // Array, Object, and Function are copy by reference.

    $scope.employeeTypes = [
        'FTE',
        'Contractor',
        'Third-Party'
    ];

    $scope.FEDS = [
        'Principal',
        'Manager',
        'Sr. Developer',
        'Developer'
    ]

    $scope.PJMS = [
        'Program Manager',
        'Project Manager',
        'Sr. Project Manager'
    ]

    $scope.employeeTypeList = [];
    $scope.employeeTitleList = [];
    $scope.searchResults = {};

    // put the watch collection here
    $scope.$watchCollection('employeeTypeList', function(newNames, oldNames) {
        if (newNames.length) {
            console.log("Type Changed. Do API call");
            // Put restangular call here
        }
    });

    $scope.$watchCollection('employeeTitleList', function(newNames, oldNames) {
        if (newNames.length) {
            console.log("Title Changed. Do API call");
            // Put restangular call here
        }
    });



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

