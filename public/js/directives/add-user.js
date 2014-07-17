angular.module('add-user-directives', [])
    .directive('addUserProfile', function($parse, $compile) {
        return {
            restrict: 'A',
            templateUrl: 'partials/add-user-profile.html'
        }
    })
    .directive('addUserContactInfo', function($parse, $compile) {
        return {
            restrict: 'A',
            templateUrl: 'partials/add-user-contact-info.html'
        }
    })

    .directive('addUserSkills', function($parse, $compile) {
        return {
            restrict: 'A',
            templateUrl: 'partials/add-user-skills.html'
        }
    })    

    .directive('addUserStrengths', function($parse, $compile) {
        return {
            restrict: 'A',
            templateUrl: 'partials/add-user-strenghts.html'
        }
    })

    .directive('addUserSystemInfo', function($parse, $compile) {
        return {
            restrict: 'A',
            templateUrl: 'partials/add-user-system-info.html'
        }
    })