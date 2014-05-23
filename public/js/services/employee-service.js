angular.module('employee-service', [])

    .factory('employee', function ($q, Restangular) {

        function directorySearch(employeeTypes, jobTitles) {
            //curl -i -X GET -H 'Content-Type: application/json' -d '{"employeeType": ["Contractor"], "title": ["Sr Web Developer", "Web Developer I"]}' http://localhost:5000/users/directory
            var d = $q.defer();

            Restangular.one('logins').post('', { username: username, password: password }).then(function(data) {
                user = {
                    token: data.key,
                    name: data.self,
                    level: data.level,
                    validLogin: true
                };
                setLocalStorage(user.token, user.name, user.level);
                d.resolve();
            }, function() {
                d.reject();
            });
            return d.promise;
        }

    });