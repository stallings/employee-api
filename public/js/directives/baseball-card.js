myApp
    .directive('employeeIntro', function($parse, $compile) {
    return {
        restrict: 'A',
        scope: {
          name: '=',
          title: '=',
          headshot: '='
        },
        templateUrl: 'partials/employee-intro.html'
    }
})

    .directive('employeeProfile', function($parse, $compile) {
        return {
            restrict: 'A',
            scope: {
                manager: '=',
                mentor: '=',
                mentee: '=',
                buddy: '=',
                start: '='
            },
            templateUrl: 'partials/employee-profile.html'
        }
    })

    .directive('employeeContact', function($parse, $compile) {
        return {
            restrict: 'A',
            scope: {
                skype: '=',
                location: '=',
                desk: '=',
                phone: '=',
                cell: '=',
                email: '='
            },
            templateUrl: 'partials/employee-contact.html'
        }
    })

    .directive('employeeStrengths', function($parse, $compile) {
        return {
            restrict: 'A',
            scope: {
                strengths: '='
            },
            templateUrl: 'partials/employee-strengths.html'
        }
    })

    .directive('employeeGrowth', function($parse, $compile) {
        return {
            restrict: 'A',
            scope: {
                growth: '='
            },
            templateUrl: 'partials/employee-growth.html'
        }
    })

    .directive('employeeSystem', function($parse, $compile) {
        return {
            restrict: 'A',
            scope: {
                computer: '=',
                asset: '=',
                last5: '=',
                software: '='
            },
            templateUrl: 'partials/employee-system.html'
        }
    });