myApp.controller('AddUserController', function($scope, $routeParams, employee) {

    $scope.results = {valid: true};
	$scope.step = 1;
	$scope.softwareInfoRows = 3;

	$scope.newUserOpts = {};
	$scope.newUserOpts.profileInfo = [];
	$scope.newUserOpts.contactInfo = [];
	$scope.newUserOpts.skills = [];
	$scope.newUserOpts.strengths = [];
	$scope.newUserOpts.sysInfo = [];
	$scope.newUserStrengthList = [];
	$scope.newUserLocationList = [];

	$scope.newUserOpts.profileInfo = [
		{"Discipline": ["Discipline1","Discipline2","Discipline3"]},
		{"Title": ["Title1","Title2","Title3"]},
		{"Manager": ["Manager1","Manager2","Manager3"]},
	];
	$scope.newUserOpts.locations = ["State Street","Hoffman Estates","Splits time evenly"];
	$scope.newUserOpts.skills = [
		{"User Analysis": ["UAOption1","UAOption2","UAOption3"]},
		{"User Research": ["UROption1","UROption2","UROption3"]},
		{"Information Architecture": ["IAOption1","IAOption2","IAOption3"]},
		{"UI design": ["UIOption1","UIOption2","UIOption3"]},
	];
	$scope.newUserOpts.strengths = [
		"Prototyping", "Angular", "HTML5", "Strength", "Video Editing", "Mobile"
	];

    $scope.getStep = function(step){
    	$scope.step = step;
    }

    $scope.addAllListsToNewUser = function(){
		$scope.newUser.strengths = newUserStrengthList;
		$scope.newUser.locations = newUserLocationList;
    }

    $scope.range = function(n) {
        return new Array(n);
    }

    $scope.addRow = function(){
    	$scope.softwareInfoRows = $scope.softwareInfoRows + 1;
    }
    
    $scope.saveNewUser = function(){
    	//////////////////////////////////////////////////////////////////
    	//// This needs to come from somewhere. Harded coded for now. ////
    	//////////////////////////////////////////////////////////////////
		$scope.newUser._id = "Test USER";
		$scope.newUser.username = "test_user";
		$scope.newUser.level = 3;
		//////////////////////////////////////////////////////////////////
		
		$scope.addAllListsToNewUser();

		console.log($scope.newUser);
	
		employee.postNewUser($scope.newUser).then(
			function(data) {
				console.log(data);
				$scope.results.valid = true;
			}
		).catch(
			function() {
				$scope.results.valid = false;
			}
		);
    }

});
	