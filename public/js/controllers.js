// This controller should use services to fill in the information
myApp.controller('SpicyController', function($scope, Auth) {
    // Always make scope objects so they are referenced, not copied
    $scope.customer = { name: "Scarlett" };

    // Todo: this should return a promise!!
    $scope.isLoggedIn = Auth.isLoggedIn();
});

myApp.controller('HomeController', function($scope) {
});

myApp.controller('SearchController', function($scope) {
});

myApp.controller('DirectoryController', function($scope) {
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

