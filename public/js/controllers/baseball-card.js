myApp.controller('BaseballCardController', function($scope, $routeParams, employee) {

    $scope.employee = {};
    $scope.results = {
        valid: true
    };

    employee.getUser($routeParams.name).then(
        function(data) {

            $scope.results.valid = true;

            $scope.employee = data;

            // Overwrite for testing
            $scope.employee.headshot = 'http://placekitten.com/150/150';

            // Modify $scope.employee.start to make it pretty

            $scope.employee.growth = "Growth opportunities go here.";

            $scope.employee.asset = "12345";
            $scope.employee.computer = "Macbook Pro (2010)";
            $scope.employee.last5 = "54284";
            $scope.employee.software = "Creative Suite CS4<br/>Omnigraffe";
        }
    ).catch(
        function() {
            $scope.results.valid = false;
        }
    );

});
