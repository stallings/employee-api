myApp.controller('BaseballCardController', function($scope, $routeParams, employee) {

    $scope.employee = {};
    $scope.results = {
        valid: true
    };

    employee.getUser($routeParams.name).then(
        function(data) {
            $scope.results.valid = true;
            $scope.employee.name = data._id ? data._id : '';
            $scope.employee.title = data.title ? data.title : '';
        }
    ).catch(
        function() {
            $scope.results.valid = false;
        }
    );

});
