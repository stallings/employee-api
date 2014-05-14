// This controller should use services to fill in the information
myApp.controller('SpicyController', function($scope) {
    // Always make scope objects so they are referenced, not copied
    $scope.customer = { name: "Scarlett" };
});