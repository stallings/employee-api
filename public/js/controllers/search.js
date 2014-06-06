myApp.controller('SearchController', function($scope, employee, myCache) {

    // Define disciplines
    $scope.disciplines = ['FED', 'PJM', 'UXA'];

    // Define skill data
    $scope.ratings = ['Choose Rating', 0, 0.5, 1.0, 1.5, 2.0, 2.5, 3.0, 3.5, 4.0, 4.5, 5.0];
    $scope.skillList = [];
    $scope.skillList['FED'] = ["User Research", "FED Skill #2", "FED Skill #3"];
    $scope.skillList['PJM'] = ["PJM Skill #1", "PJM Skill #2", "PJM Skill #3"];
    $scope.skillList['UXA'] = ["UXA Skill #1", "UXA Skill #2", "UXA Skill #3"];

    // Define strength data
    $scope.strengthList = [];
    $scope.strengthList['FED'] = ["Karate", "Presentation", "FED Strength #3"];
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
        selectedRating: $scope.ratings[0],
        predicate: '_id',
        count: 0,
        reverse: false
    };

    $scope.searchResults = {};

    if (myCache.get('search')) {
        $scope.search = myCache.get('search');
        $scope.searchResults = myCache.get('searchResults');
    }

    $scope.changeSkills = function(discipline){
        $scope.search.skills = $scope.skillList[discipline];
        $scope.search.selectedSkill = $scope.search.skills[0];
        $scope.search.selectedRating = $scope.ratings[0];
    };

    $scope.changeStrengths = function(discipline){
        $scope.search.strengths = $scope.strengthList[discipline];
        $scope.search.selectedStrength = [];
    };

    $scope.setSubmitted = function() {
        $scope.search.submitted = true;
        $scope.search.buttonName = 'Refine';
    };

    $scope.showSkills = function() {
        return (employee.getLevel() >= 3);
    };

    $scope.showResults = function(data) {
        $scope.search.count = data.count;
        $scope.searchResults = data.results;
        myCache.put('search', $scope.search);
        myCache.put('searchResults', $scope.searchResults);
    };

    $scope.complexSearch = function() {
        var rating = ($scope.search.selectedRating === $scope.ratings[0]) ? -1 : $scope.search.selectedRating;
        employee.complexSearch($scope.search.name, $scope.search.selectedStrength, $scope.search.selectedSkill, rating).then(
            function (data) {
                $scope.showResults(data);
            }
        );
    };

    $scope.searchByName = function() {
        if (!$scope.search.submitted) {
            employee.getUserBySubstring($scope.search.name).then(
                function (data) {
                    $scope.showResults(data);
                    $scope.setSubmitted();
                }
            );
        } else {
            $scope.complexSearch();
        }
    };

    $scope.searchBySkills  = function() {
        var rating = ($scope.search.selectedRating === $scope.ratings[0]) ? -1 : $scope.search.selectedRating;
        if (!$scope.search.submitted) {
            if (rating) {
                employee.skillSearch($scope.search.selectedSkill, rating).then(
                    function (data) {
                        $scope.showResults(data);
                        $scope.setSubmitted();
                    }
                );
            }
        } else {
            $scope.complexSearch();
        }
    };

    $scope.searchByStrengths  = function() {
        if (!$scope.search.submitted) {
            employee.strengthSearch($scope.search.selectedStrength).then(
                function (data) {
                    $scope.showResults(data);
                    $scope.setSubmitted();
                }
            );
        } else {
            $scope.complexSearch();
        }
    };

});