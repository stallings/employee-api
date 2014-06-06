var myApp = angular.module('employeeApp', ['ngRoute','restangular', 'pasvaz.bindonce', 'ngSanitize', 'MyAwesomePartials', 'search-directives', 'employee-directives', 'employee-api', 'checklist-model']);

myApp.config(function($routeProvider, RestangularProvider) {
    $routeProvider
        .when('/', {
            templateUrl: 'partials/search.html',
            controller: 'SearchController'
        })
        .when('/directory/', {
            templateUrl: 'partials/directory.html',
            controller: 'DirectoryController'
        })
        .when('/users/:name/', {
            templateUrl: 'partials/baseball-card.html',
            controller: 'BaseballCardController'
        })
        .otherwise({
            redirectTo: '/'
        });
    RestangularProvider.setBaseUrl('/api/v1');
});

myApp.factory('myCache', function($cacheFactory) {
    return $cacheFactory('myData');
});