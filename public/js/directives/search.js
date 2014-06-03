angular.module('search-directives', [])

    .directive('searchName', function($parse, $compile) {
        return {
            restrict: 'A',
            templateUrl: 'partials/search-name.html'
        }
    })

    .directive('searchSkills', function($parse, $compile) {
        return {
            restrict: 'A',
            templateUrl: 'partials/search-skills.html'
        }
    })

    .directive('searchStrengths', function($parse, $compile) {
        return {
            restrict: 'A',
            templateUrl: 'partials/search-strengths.html'
        }
    });
