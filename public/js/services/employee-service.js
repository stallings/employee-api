angular.module('employee-service', [])

    .factory('employee', function ($q, Restangular) {

        function directorySearch(employeeTypes, jobTitles) {
            var d = $q.defer();
            var searchObject = {};

            if(employeeTypes.length) {
                searchObject.employeeType = employeeTypes;
            }
            if(jobTitles.length) {
                searchObject.title = jobTitles;
            }
            Restangular.one('users').post('directory', searchObject).then(function(data) {
                d.resolve(data), function() {
                    d.reject();
                };
            });
            return d.promise;
        }

        function getUser(name) {
            var d = $q.defer();
            var searchObject = {};

            if(employeeTypes.length) {
                searchObject.employeeType = employeeTypes;
            }
            if(jobTitles.length) {
                searchObject.title = jobTitles;
            }
            Restangular.one('users').post('directory', searchObject).then(function(data) {
                d.resolve(data), function() {
                    d.reject();
                };
            });
            return d.promise;
        }

        var service = {
            directorySearch: function(employeeTypes, jobTitles) {
                return directorySearch(employeeTypes, jobTitles);
            },
            getUser: function(name) {
                return getUser(name);
            }
        };

        return service;

    });