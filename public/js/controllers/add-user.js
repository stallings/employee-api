myApp.controller('AddUserController', function($scope, $routeParams, employee) {
	console.log('Add User Controller');

    $scope.results = {
        valid: true
    };
	
	$scope.step = 1;
	$scope.newUserOpts = {};
	$scope.newUserOpts.profileInfo = [];
	$scope.newUserOpts.contactInfo = [];
	$scope.newUserOpts.skills = [];
	$scope.newUserOpts.strengths = [];
	$scope.newUserOpts.sysInfo = [];

	$scope.newUserOpts.profileInfo = [
		{"Discipline": ["Discipline1","Discipline2","Discipline3"]},
		{"Title": ["Title1","Title2","Title3"]},
		{"Manager": ["Manager1","Manager2","Manager3"]},
	];

	$scope.newUserOpts.contactInfo = [
		{"Location": ["State Street","Hoffman Estates","Splits time evenly"]}, 
	];

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
    
    $scope.postNewUser = function(){
    	$scope.testUser = {};
		$scope.testUser._id = "Devin Stallings";
		$scope.testUser.username = "stall";
		$scope.testUser.level = 3;

		console.log($scope.testUser);
	
		employee.postNewUser($scope.testUser).then(
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
	