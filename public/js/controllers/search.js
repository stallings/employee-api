myApp.controller('SearchController', function($scope) {

    // Define disciplines
    $scope.disciplines = ['FED', 'PJM', 'UXA'];

    // Define skill data
    $scope.ratings = [0, 0.5, 1.0, 1.5, 2.0, 2.5, 3.0, 3.5, 4.0, 4.5, 5.0];
    $scope.skillList = [];
    $scope.skillList['FED'] = ["FED Skill #1", "FED Skill #2", "FED Skill #3"];
    $scope.skillList['PJM'] = ["PJM Skill #1", "PJM Skill #2", "PJM Skill #3"];
    $scope.skillList['UXA'] = ["UXA Skill #1", "UXA Skill #2", "UXA Skill #3"];

    // Define strength data
    $scope.strengthList = [];
    $scope.strengthList['FED'] = ["FED Strength #1", "FED Strength #2", "FED Strength #3"];
    $scope.strengthList['PJM'] = ["PJM Strength #1", "PJM Strength #2", "PJM Strength #3"];
    $scope.strengthList['UXA'] = ["UXA Strength #1", "UXA Strength #2", "UXA Strength #3"];

    // Initialize controller
    $scope.search = {
        name: '',
        submitted: false,
        buttonName : 'Search',
        selectedDisciplineSkill: 'FED',
        selectedDisciplineStrength: 'PJM',
        skills: $scope.skillList['FED'],
        selectedSkill: $scope.skillList['FED'][0],
        strengths: $scope.strengthList['PJM'],
        selectedStrength: [],
        selectedRating: $scope.ratings[6]
    };

    $scope.changeSkills = function(discipline){
        $scope.search.skills = $scope.skillList[discipline];
        $scope.search.selectedSkill = $scope.search.skills[0];
    };

    $scope.changeStrengths = function(discipline){
        $scope.search.strengths = $scope.strengthList[discipline];
        $scope.search.selectedStrength = [];
    };

    $scope.searchByName = function() {
        if (!$scope.search.submitted) {
            console.log('do a name search with: ' + $scope.search.name);
            $scope.search.submitted = true;
            $scope.search.buttonName = 'Refine';
        } else {
            console.log('do a search with ALL values');
        }
    };

    $scope.searchBySkills  = function() {
        if (!$scope.search.submitted) {
            console.log('do a skill search with: ' + $scope.search.selectedSkill + ' ' + $scope.search.selectedRating);
            $scope.search.submitted = true;
            $scope.search.buttonName = 'Refine';
        } else {
            console.log('do a search with ALL values');
        }
    };

    $scope.searchByStrengths  = function() {
        if (!$scope.search.submitted) {
            console.log('do a strength search with: ' + $scope.search.selectedStrength);
            $scope.search.submitted = true;
            $scope.search.buttonName = 'Refine';
        } else {
            console.log('do a search with ALL values');
        }
    };



});