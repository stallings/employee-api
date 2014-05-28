var myApp = angular.module('employeeApp', ['ngRoute','restangular', 'pasvaz.bindonce', 'authentication-service', 'employee-service']);

myApp.config(function($routeProvider,RestangularProvider) {
    $routeProvider
        .when('/', {
            templateUrl: 'partials/home.html',
            controller: 'HomeController'
        })
        .when('/search', {
            templateUrl: 'partials/search.html',
            controller: 'SearchController'
        })
        .when('/directory', {
            templateUrl: 'partials/directory.html',
            controller: 'DirectoryController'
        })
        .when('/orgchart', {
            templateUrl: 'partials/orgchart.html',
            controller: 'OrgChartController'
        })
        .when('/users/:name', {
            templateUrl: 'partials/baseball-card.html',
            controller: 'BaseballCardController'
        })
        .when('/add', {
            templateUrl: 'partials/add-user.html',
            controller: 'AddUserController'
        })
        .otherwise({
            redirectTo: '/'
        });
    RestangularProvider.setBaseUrl('/api/v1');
});