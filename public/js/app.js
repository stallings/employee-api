var myApp = angular.module('employeeApp', ['ngRoute','restangular', 'pasvaz.bindonce', 'ngSanitize', 'MyAwesomePartials', 'search-directives', 'employee-directives', 'orgchart-directives', 'employee-api', 'checklist-model', 'add-user-directives']);

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
        .when('/orgchart/:name/', {
            templateUrl: 'partials/orgchart.html',
            controller: 'OrgChartController'
        })
        .when('/adduser/:step', {
            templateUrl: 'partials/add-user.html',
            controller: 'AddUserController'
        })
        .otherwise({
            redirectTo: '/'
        });
    RestangularProvider.setBaseUrl('/api/v1');
});

myApp.factory('myCache', function($cacheFactory) {
    return $cacheFactory('myData');
});