myApp.controller('DirectoryController', function($scope, employee, myCache) {

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

    $scope.directory = {
        predicate: '_id',
        count: 0,
        reverse: false
    };
    $scope.directoryResults = {};

    if (myCache.get('directory')) {
        $scope.directory = myCache.get('directory');
        $scope.directoryResults = myCache.get('directoryResults');
    }

    $scope.directorySearch = function() {
        employee.directorySearch($scope.employeeTypeList, $scope.employeeTitleList).then(
            function (data) {
                $scope.directory.count = data.count;
                $scope.directoryResults = data.results;
                myCache.put('directory', $scope.directory);
                myCache.put('directoryResults', $scope.directoryResults);
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