myApp.controller('OrgChartController', function($scope, $routeParams, employee) {

    $scope.employee = {};
    $scope.results = {
        valid: true
    };

    employee.getUserOrgChart($routeParams.name).then(
        function(data) {
            $scope.results.valid = true;
            $scope.employee = data;
        }
    ).catch(
        function() {
            $scope.results.valid = false;
        }
    );

});
