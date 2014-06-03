myApp.controller('SearchController', function($scope) {

    $scope.search = {
        name: '',
        submitted: false
    };



    $scope.searchByName = function() {
        console.log('search by name clicked');
        $scope.search.submitted = true;
    };

//    $scope.employeeTypes = [
//        'FTE',
//        'Contractor',
//        'Third-Party'
//    ];
//
//    $scope.FEDS = [
//        'Principal',
//        'Manager',
//        'Sr. Developer',
//        'Web Developer'
//    ]
//
//    $scope.PJMS = [
//        'Program Manager',
//        'Project Manager',
//        'Sr. Project Manager'
//    ]
//
//    $scope.employeeTypeList = [];
//    $scope.employeeTitleList = [];
//    $scope.searchResults = {};
//    $scope.directoryResults = {
//        predicate: '_id',
//        count: 0,
//        reverse: false
//    };
//
//    $scope.$watchCollection('employeeTypeList', function(newNames, oldNames) {
//        if (newNames !== oldNames) {
//            employee.directorySearch($scope.employeeTypeList, $scope.employeeTitleList).then(
//                function (data) {
//                    $scope.directoryResults.count = data.count;
//                    $scope.searchResults = data.results;
//                    console.log('one');
//                }
//            );
//        }
//    });
//
//    $scope.$watchCollection('employeeTitleList', function(newNames, oldNames) {
//        if (newNames !== oldNames) {
//            employee.directorySearch($scope.employeeTypeList, $scope.employeeTitleList).then(
//                function (data) {
//                    $scope.directoryResults.count = data.count;
//                    $scope.searchResults = data.results;
//                    console.log('two');
//                }
//            );
//        }
//    });

});