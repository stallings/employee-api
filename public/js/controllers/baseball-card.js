myApp.controller('BaseballCardController', function($rootScope, $scope, $routeParams, employee, $location, $timeout) {
    $scope.employee = {};
    $scope.results = {
        valid: true
    };
    $scope.fadeOutUp = false;
    
    $scope.showMessage = function(){
        $timeout(function(){
            $scope.fadeOutUp = true;
            $timeout(function(){
                $rootScope.successful = false;
            },400);
        }, 8000);
    }

    if($rootScope.successful === true){
        $scope.showMessage();
    }
    
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
