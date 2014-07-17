myApp.controller('AddUserController', function($scope, $routeParams) {
	console.log('Add User Controller');

    $scope.getStep = function($routeParams){
    	console.log('getStep');
    	$scope.addUser = {};
    	if ($routeParams.step){
    		$scope.addUser.step = $routeParams.step;
    	}
    	else{
    		$scope.addUser.step= "step1";
    	}

    }
    $scope.getStep($routeParams);

});
	