myApp.controller('DirectoryController', function($scope, employee) {

    $scope.employeeTypes = [
        'FTE',
        'Contractor',
        'Third-Party'
    ];

    $scope.FEDS = [
        'Principal',
        'Manager',
        'Sr. Developer',
        'Web Developer'
    ]

    $scope.PJMS = [
        'Program Manager',
        'Project Manager',
        'Sr. Project Manager'
    ]

    $scope.employeeTypeList = [];
    $scope.employeeTitleList = [];
    $scope.searchResults = {};
    $scope.directoryResults = {
        predicate: '_id',
        count: 0,
        reverse: false
    };

    $scope.$watchCollection('employeeTypeList', function(newNames, oldNames) {
        employee.directorySearch($scope.employeeTypeList, $scope.employeeTitleList).then(
            function(data) {
                $scope.directoryResults.count = data.count;
                $scope.searchResults = data.results;
            }
        );
    });

    $scope.$watchCollection('employeeTitleList', function(newNames, oldNames) {
        employee.directorySearch($scope.employeeTypeList, $scope.employeeTitleList).then(
            function(data) {
                $scope.directoryResults.count = data.count;
                $scope.searchResults = data.results;
            }
        );
    });



});