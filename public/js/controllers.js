// This controller should use services to fill in the information
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

myApp.controller('HomeController', function($scope) {
});

myApp.controller('SearchController', function($scope) {
});

myApp.controller('DirectoryController', function($scope, employee) {

    $scope.employeeTypes = [
        'FTE',
        'Contractor',
        'Third-Party'
    ];

    $scope.FEDS = [
        'Principal',
        'Manager',
        'Sr. Developer',
        'Web Developer'
    ]

    $scope.PJMS = [
        'Program Manager',
        'Project Manager',
        'Sr. Project Manager'
    ]

    $scope.employeeTypeList = [];
    $scope.employeeTitleList = [];
    $scope.searchResults = {};
    $scope.directoryResults = {
        count: 0
    };

    $scope.$watchCollection('employeeTypeList', function(newNames, oldNames) {
            employee.directorySearch($scope.employeeTypeList, $scope.employeeTitleList).then(
                function(data) {
                    $scope.directoryResults.count = data.count;
                    $scope.searchResults = data.results;
                }
            );
    });

    $scope.$watchCollection('employeeTitleList', function(newNames, oldNames) {
            employee.directorySearch($scope.employeeTypeList, $scope.employeeTitleList).then(
                function(data) {
                    $scope.directoryResults.count = data.count;
                    $scope.searchResults = data.results;
                }
            );
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

