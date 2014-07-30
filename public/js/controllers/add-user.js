myApp.controller('AddUserController', function($scope, $routeParams, employee, $location) {

    $scope.results = {valid: true};
	$scope.step = 1;
	$scope.softwareInfoRows = 2;

	$scope.newUserOpts = {};
	$scope.newUserOpts.profileInfo = [];
	$scope.newUserOpts.contactInfo = [];
	$scope.newUserOpts.skills = [];
	$scope.newUserOpts.strengths = [];
	$scope.newUserOpts.sysInfo = [];
	$scope.newUserStrengthList = [];
	$scope.newUserLocationList = [];
	$scope.newUserOsList = [];

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
	$scope.newUserOpts.strengths = [ "Prototyping", "Angular", "HTML5", "Strength", "Video Editing", "Mobile"];

	$scope.newUserOpts.os = ["OSX", "Windows XP", "Windows 7", "Windows 8"];

    $scope.getStep = function(step){
    	$scope.step = step;
    }

    $scope.addAllListsToNewUser = function(){
		$scope.newUser.strengths = $scope.newUserStrengthList;
		$scope.newUser.locations = $scope.newUserLocationList;
		$scope.newUser.operatingsystem = $scope.newUserOsList;
    }

    $scope.range = function(n) {
        return new Array(n);
    }

    $scope.addRow = function(){
    	//Max amout of rows to add
    	if($scope.softwareInfoRows !== 8){
    		$scope.softwareInfoRows = $scope.softwareInfoRows + 1;
    	}
    }
    $scope.removeRow = function(){
    	//Min amount of rows
    	if($scope.softwareInfoRows !== 1){
    		$scope.softwareInfoRows = $scope.softwareInfoRows - 1;
    	}
    }

    $scope.createUserId = function(first, last){
    	$scope.newUser._id = first + " " + last;
    }
    $scope.createUserName = function(first, last){	
    	$scope.newUser.username = first.charAt(0) + last.substr(0,6);
    	$scope.newUser._id = $scope.newUser._id.toLowerCase();
    }

    $scope.showCardForNewUser = function(first, last){
    	// $location.path("/users/" + first + "%20" + last +"%3Fsuccess=true");
    	$location.path("/users/" + first + "%20" + last);
    }

    $scope.saveNewUser = function(){
    	var first = $scope.newUser.firstName;
    	var last = $scope.newUser.lastName;
    	//////////////////////////////////////////////////////////////////
    	//// This needs to come from somewhere. Harded coded for now. ////
    	//////////////////////////////////////////////////////////////////
		$scope.createUserId(first, last);
		$scope.createUserName(first, last);
		$scope.newUser.level = 3;
		//////////////////////////////////////////////////////////////////
		
		$scope.addAllListsToNewUser();

		console.log($scope.newUser);

		$scope.showCardForNewUser(first, last);
	
		// employee.postNewUser($scope.newUser).then(
		// 	function(data) {
		// 		console.log(data);
		// 		$scope.results.valid = true;

		// 		// TODO: If valid results then redirect to baseball card page for the new user
		// 	}
		// ).catch(
		// 	function() {
		// 		$scope.results.valid = false;
		// 	}
		// );
    }

});
	