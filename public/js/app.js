var myApp = angular.module('employeeApp', ['ngRoute']);

myApp.config(function($routeProvider) {
    $routeProvider
        .when('/', {
            templateUrl: 'partials/home.html',
            controller: 'SpicyController'
        })
        .when('/login', {
            templateUrl: 'partials/login.html',
            controller: 'SpicyController'
        })
        .otherwise({
            redirectTo: '/'
        });
});