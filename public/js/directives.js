// Only worry about putting placeholders in directives, the controller will take care of filling them out
myApp.directive('myDirective', function() {
    return {
        restrict: 'A',
        replace: true,
        template: '<a href="#login">Click me to go {{customer.name}} to Google</a>'
    }
});