myApp.controller('BaseballCardController', function($scope, $routeParams, employee) {

    $scope.employee = {};

    employee.getUser($routeParams.name).then(
        function(data) {
            $scope.employee.name = data._id;
            $scope.employee.title = data.title;
        }
    ).catch(
        function() {
            // reveal a different div in the template that says user not found
            console.log('user does not exist! show the user not found div!');
        }
    );

});
