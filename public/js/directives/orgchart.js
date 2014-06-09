angular.module('orgchart-directives', [])

    .directive('orgchart', function($parse, $compile) {
        return {
            restrict: 'A',
            scope: {
                employee: '='
            },
            templateUrl: 'partials/orgchart-chart.html'
        }
    });