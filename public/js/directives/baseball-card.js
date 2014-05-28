myApp
    .directive('employeeIntro', function($parse, $compile) {
    return {
        restrict: 'A',
        templateUrl: 'partials/employee-intro.html'
    }
})

    .directive('employeeProfile', function($parse, $compile) {
        return {
            restrict: 'A',
            template: '<div class="sparkline">profile!</div>'
        }
    })

    .directive('employeeContact', function($parse, $compile) {
        return {
            restrict: 'A',
            template: '<div class="sparkline">contact!</div>'
        }
    })

    .directive('employeeStrengths', function($parse, $compile) {
        return {
            restrict: 'A',
            template: '<div class="sparkline">strengths!</div>'
        }
    })

    .directive('employeeGrowth', function($parse, $compile) {
        return {
            restrict: 'A',
            template: '<div class="sparkline">growth!</div>'
        }
    })

    .directive('employeeSystem', function($parse, $compile) {
        return {
            restrict: 'A',
            template: '<div class="sparkline">system!</div>'
        }
    });