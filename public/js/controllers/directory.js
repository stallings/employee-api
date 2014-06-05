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

    $scope.directorySearch = function() {
        employee.directorySearch($scope.employeeTypeList, $scope.employeeTitleList).then(
            function (data) {
                $scope.directoryResults.count = data.count;
                $scope.searchResults = data.results;
            }
        );
    };

    $scope.$watchCollection('employeeTypeList', function(newNames, oldNames) {
        if (newNames !== oldNames) {
            $scope.directorySearch();
        }
    });

    $scope.$watchCollection('employeeTitleList', function(newNames, oldNames) {
        if (newNames !== oldNames) {
            $scope.directorySearch();
        }
    });



});