/* jshint node: true */
module.exports = function (app) {
    "use strict";

    var User = require('../models/user'),
        Project = require('../models/project'),
        Key = require('../models/key'),
        bcrypt = require('bcrypt');


    function makeDirectorKey(level, user, myUsers, res) {
        User.find({
            _id: {
                $in: myUsers
            }
        }, 'directs').lean().exec(function (err, users) {
            for (var i = 0; i < users.length; i++) {
                for (var j = 0; j < users[i].directs.length; j++) {
                    myUsers.push(users[i].directs[j]);
                }
            }
            makeKey(level, user, myUsers, res);
        });
    }

    function findUsers(req, res, next, searchObject) {
        var data = {};

        User.find(searchObject, '_id title').lean().exec(function (err, users) {
            if (err) {
                return next(new Error(err.message));
            } else if (!users.length) {
                var newErr = new Error('No users found');
                newErr.status = 404;
                return next(newErr);
            } else {
                data.count = users.length;
                data.results = users;
                res.jsonp(data);
            }
        });
    }

    function checkAuth(req, res, next) {
        var newErr;
        if (req.query.key !== undefined) {
            Key.find({
                '_id': req.query.key
            }).lean().exec(function (err, key) {
                if (err) {
                    return next(new Error(err.message));
                } else if (!key.length) {
                    newErr = new Error('Not authorized');
                    newErr.status = 401;
                    return next(newErr);
                } else {
                    // If we are VP, we are always authorized
                    if (key[0].level === 4) {
                        return next();

                        // If we are Director/Manager
                    } else if ((key[0].level === 2) || (key[0].level === 3)) {

                        // If no userid is passed, we are creating project/user (allow)
                        if (req.params.userid === undefined) {
                            return next();

                        } else {
                            // Allow trying to edit/delete a direct report only
                            if (key[0].edit.indexOf(req.params.userid) !== -1) {
                                return next();
                            } else {
                                newErr = new Error('Forbidden. User is not a direct report.');
                                newErr.status = 403;
                                return next(newErr);
                            }
                        }

                        // Regular users are not allowed to edit anything
                    } else {
                        newErr = new Error('Forbidden. User is not a direct report.');
                        newErr.status = 403;
                        return next(newErr);
                    }
                }
            });
        } else {
            newErr = new Error('Not authorized');
            newErr.status = 401;
            return next(newErr);
        }
    }

    // Makes a key
    function makeKey(level, user, directs, res) {
        var myKey = new Key({
            'level': level,
            'self': user,
            'edit': directs
        });
        myKey.save(function (err) {
            if (err) {
                res.jsonp(500, {
                    error: err.message
                });
            } else {
                res.jsonp({
                    'key': myKey._id,
                    'level': level,
                    'self': user
                });
            }
        });
    }


    /* ********************************* */
    // Route: GET /
    // Description: Returns the UX API version
    //
    // Sample curl:
    // curl -i -X GET http://localhost:5000/
    /* ********************************* */
//    app.get('/', function (req, res) {
//        res.jsonp({
//            'version': '0.0.1'
//        });
//    });


    /* ********************************* */
    // Route: GET /users
    // Description: Get all user names and IDs
    //
    // Sample curl:
    // curl -i -X GET http://localhost:5000/users
    /* ********************************* */
    app.get('/api/v1/users', function (req, res, next) {
        var searchObject = {};
        findUsers(req, res, next, searchObject);
    });

    /* ********************************* */
    // Route: GET /users/search/string
    // Description: Get all names that contain the string
    //
    // Sample curl:
    // curl -i -X GET http://localhost:5000/users/search/string
    /* ********************************* */
    app.get('/api/v1/users/search/:string', function (req, res, next) {
        var searchObject = {};
        searchObject._id = new RegExp(req.params.string, 'i');
        findUsers(req, res, next, searchObject);
    });

    /* ********************************* */
    // Route: GET /users/advancedsearch
    // Description: Does complex search based on parameters passed in header
    //
    // Sample curls:
    // curl -i -X GET -H 'Content-Type: application/json' -d '{"name": "Jose"}' http://localhost:5000/users/advancedsearch
    // curl -i -X GET -H 'Content-Type: application/json' -d '{"strengths": ["Presentation","Karate"]}' http://localhost:5000/users/advancedsearch
    // curl -i -X GET -H 'Content-Type: application/json' -d '{"skills": { "title": "User Research", "rating": 3.5 }}' http://localhost:5000/users/advancedsearch
    // curl -i -X GET -H 'Content-Type: application/json' -d '{"name": "Jose", "strengths": ["Presentation"], "skills": { "title": "User Research", "rating": 3.5 }}' http://localhost:5000/users/advancedsearch
    /* ********************************* */
    app.get('/api/v1/users/advancedsearch', function (req, res, next) {

        var searchObject = {};

        // Do a regular expression for name
        if (req.body.name !== undefined) {
            searchObject._id = new RegExp(req.body.name, 'i');
        }

        // Make sure we find people that have ALL strenghts specified
        if (req.body.strengths !== undefined) {
            searchObject.strengths = { '$all': req.body.strengths };
        }

        if (req.query.key !== undefined) {
            Key.find({
                '_id': req.query.key
            }, function (err, key) {
                if (err) {
                    findUsers(req, res, next, searchObject);
                } else if ((key.length) && (key[0].level > 1) && (req.body.skills !== undefined)) {
                            // Only add skills if it's a manager or above
                            searchObject.skills = { '$elemMatch': { title: req.body.skills.title, rating: { $gte: req.body.skills.rating } }  };
                            findUsers(req, res, next, searchObject);
                 } else {
                    findUsers(req, res, next, searchObject);
                }
            });
        } else {
            findUsers(req, res, next, searchObject);
        }
    });

    /* ********************************* */
    // Route: GET /users/directory
    // Description: Does complex search based on parameters passed in header
    //
    // Sample curls:
    // curl -i -X GET -H 'Content-Type: application/json' -d '{"employeeType": ["Contractor"], "title": ["Sr Web Developer", "Web Developer I"]}' http://localhost:5000/users/directory
    // curl -i -X GET -H 'Content-Type: application/json' -d '{"employeeType": ["Contractor"]}' http://localhost:5000/users/directory
    // curl -i -X GET -H 'Content-Type: application/json' -d '{"title": ["Sr Web Developer", "Web Developer I"]}' http://localhost:5000/users/directory
    /* ********************************* */
    app.get('/api/v1/users/directory', function (req, res, next) {

        var searchObject = {};
        if (req.body.employeeType !== undefined) {
            searchObject.employeeType = { '$in': req.body.employeeType };
        }
        if (req.body.title !== undefined) {
            searchObject.title = { '$in': req.body.title };
        }
        findUsers(req, res, next, searchObject);
    });

    /* ********************************* */
    // Route: GET /users/orgchart/string
    // Description: Get Org Chart
    //
    // Sample curl:
    // curl -i -X GET http://localhost:5000/users/orgchart/userid
    /* ********************************* */
    app.get('/api/v1/users/orgchart/:userid', function (req, res, next) {

        /** @namespace req.params.userid */
        User.findOne({
            '_id': req.params.userid
        }, function (err, user) {
            if (err) {
                return next(new Error(err.message));
            } else if (!user) {
                var newErr = new Error('User not found');
                newErr.status = 404;
                return next(newErr);
            } else {

                if (user._id !== "VP Name") {

                    // Get the titles of manager and direct reports
                    var idsToSearch = Array.prototype.concat(user.manager, user.directs);

                    User.find({
                        '_id': {
                            $in: idsToSearch
                        }
                    }, 'title').lean().exec(function (err, userTitles) {
                        if (err) {
                            return next(new Error(err.message));
                        } else if (!userTitles.length) {
                            var newErr = new Error('No users titles found');
                            newErr.status = 404;
                            return next(newErr);
                        } else {
                            // Create array with name -> title
                            var nameAndTitles = [];
                            for (var i = 0; i < userTitles.length; i++) {
                                nameAndTitles[userTitles[i]._id] = userTitles[i].title;
                            }

                            var orgChartData = [
                                {
                                    name: user.manager + "|" + nameAndTitles[user.manager],
                                    parent: "null",
                                    children: [
                                        {
                                            name: user._id + "|" + user.title,
                                            parent: user.manager + "|" + nameAndTitles[user.manager],
                                            children: []
                                        }
                                    ]
                                }
                            ];

                            for (var j = 0; j < user.directs.length; j++) {
                                orgChartData[0].children[0].children.push({
                                    name: user.directs[j] + "|" + nameAndTitles[user.directs[j]],
                                    parent: user._id + "|" + user.title
                                });
                            }
                            res.jsonp(orgChartData);
                        }
                    });

                    // If it's VP, make a pre-defined structure
                } else {

                    console.log('finish this');
                    /*

                     // Step 1: Find all direct reports
                     User.find({
                     '_id': {
                     $in: ["Name", "Name", "Name", "Name"]
                     }
                     }, 'directs').lean().exec(function(err, userDirects) {

                     // Step 2: Put them in an array
                     // Step 3: Use that array to get all their titles, put in array
                     // Step 4: Add to our structure

                     var orgChartData = [
                     {
                     name: user._id + "|" + user.title,
                     parent: "null",
                     children: [
                     {
                     name: "Name" + "|" + "Director Web Dev",
                     parent: user._id + "|" + user.title,
                     children: [],
                     name: "Name" + "|" + "Director Creative",
                     parent: user._id + "|" + user.title,
                     children: [],
                     name: "Name" + "|" + "Director UXA",
                     parent: user._id + "|" + user.title,
                     children: [],
                     name: "Name" + "|" + "Director Content Strategy",
                     parent: user._id + "|" + user.title,
                     children: []
                     }]
                     }];

                     */

                }
            }
        });
    });


    /* ********************************* */
    // Route: GET /users/id,id
    // Description: Get one or more users
    //
    // Sample curl:
    // curl -i -X GET http://localhost:5000/users/id,id
    /* ********************************* */
    app.get('/api/v1/users/:userid', function (req, res, next) {

        // If multiple users requested, return info for each (less than individual)
        if (req.params.userid.indexOf(',') !== -1) {
            User.find({
                '_id': {
                    $in: req.params.userid.split(",")
                }
            }, '-skills').lean().exec(function (err, user) {
                if (err) {
                    return next(new Error(err.message));
                } else if (!user.length) {
                    var newErr = new Error('No users found');
                    newErr.status = 404;
                    return next(newErr);
                } else {
                    res.jsonp(user);
                }
            });

            // If only one user requested, return more detailed information
        } else {
            User.find({
                '_id': req.params.userid
            }).lean().exec(function (err, user) {
                if (err) {
                    return next(new Error(err.message));
                } else if (!user.length) {
                    var newErr = new Error('No users found');
                    newErr.status = 404;
                    return next(newErr);
                } else {

                    // If valid key, send skills
                    if (req.query.key !== undefined) {
                        Key.find({
                            '_id': req.query.key
                        }).lean().exec(function (err, key) {
                            if (err) {
                                delete user[0].skills;
                                res.jsonp(user);
                            } else if (!key.length) {
                                delete user[0].skills;
                                res.jsonp(user);
                            } else {
                                // VP - return everything
                                if (key[0].level === 4) {
                                    res.jsonp(user);

                                    // Director/Manager - return skill for themselves and direct reports
                                } else if ((key[0].level === 3) || (key[0].level === 2)) {

                                    // If they are requesting themselves, return all info
                                    if (key[0].self === req.params.userid) {
                                        res.jsonp(user);
                                        // Else If the are requesting direct reports, return all info
                                    } else if (key[0].edit.indexOf(req.params.userid) !== -1) {
                                        res.jsonp(user);
                                        // Else, delete the skills
                                    } else {
                                        delete user[0].skills;
                                        res.jsonp(user);
                                    }

                                    // Regular Users
                                } else {
                                    // If they are requesting just themselves, return all info
                                    if (key[0].self === req.params.userid) {
                                        res.jsonp(user);
                                        // Else delete the user skills
                                    } else {
                                        delete user[0].skills;
                                        res.jsonp(user);
                                    }
                                }
                            }
                        });
                        // Otherwise, don't include skills
                    } else {
                        delete user[0].skills;
                        res.jsonp(user);
                    }
                }
            });
        }
    });


    /* ********************************* */
    // Route: POST /users
    // Description: Add a user. Validation happens at schema level
    //
    // Sample curl:
    // curl -i -X POST -H 'Content-Type: application/json' -d '{"_id": "Billy Archibald7", "username": "billy", "level": 3}' http://localhost:5000/users?key=5351402ea096c331093a8e0f
    /* ********************************* */
    app.post('/api/v1/users', checkAuth, function (req, res, next) {
        var myUser = new User(req.body);
        myUser.save(function (err) {
            if (err) {
                return next(new Error(err.message));
            } else {
                res.set('Location', req.protocol + '://' + req.get('host') + req.path + '/' + encodeURIComponent(myUser._id));
                res.send(201);
            }
        });
    });

    /* ********************************* */
    // Route: PUT /users/id
    // Description: Modify required user information. Validation happens at schema level.
    //
    // Sample curl:
    // curl -i -X PUT -H 'Content-Type: application/json' -d '{"department": "FED"}' 'http://localhost:5000/users/Jose Pulgar?key=532b0ded565784050ab40b02'
    /* ********************************* */
    app.put('/api/v1/users/:userid', checkAuth, function (req, res, next) {
        var query = {
            _id: req.params.userid
        };

        User.update(query, {
            $set: req.body
        }, function (err) {
            if (err) {
                return next(new Error(err.message));
            } else {
                res.jsonp({
                    'id': req.params.userid
                });
            }
        });
    });

    /* ********************************* */
    // Route: PUT /users/id/skills
    // Description: Add/Modify Skills
    //
    // Sample curl:
    // curl -i -X PUT -H 'Content-Type: application/json' -d '[{"_id": "HTML", "rating": "5.0"}, {"title": "CSS", "rating": "4.5"}]' http://localhost:5000/users/John%20Smith/skills?key=532b0ded565784050ab40b02
    /* ********************************* */
    app.put('/api/v1/users/:userid/skills', checkAuth, function (req, res, next) {
        var query = {
            _id: req.params.userid
        };

        // Remove other skills
        User.update(query, {
            $set: {
                skills: []
            }
        }, function (err) {
            if (err) {
                return next(new Error('Unable to delete user skills'));
            }
        });

        // Add all skills
        User.update(query, {
            $addToSet: {
                skills: {
                    $each: req.body
                }
            }
        }, function (err, numberAffected) {
            if (err) {
                return next(new Error(err.message));
            } else if (numberAffected) {
                res.jsonp({
                    'id': req.params.userid
                });
            } else {
                return next(new Error('No rows affected'));
            }
        });
    });

    /* ********************************* */
    // Route: DELETE /users/id
    // Description: Delete a user
    //
    // Sample curl:
    // curl -i -X DELETE http://localhost:5000/users/John%20Smith
    /* ********************************* */
    app.delete('/api/v1/users/:userid', checkAuth, function (req, res, next) {
        User.findByIdAndRemove(req.params.userid, function (err, resource) {
            if (err) {
                return next(new Error(err.message));
            } else if (resource) {
                res.send(204);
            } else {
                var newErr = new Error('User not found');
                newErr.status = 404;
                return next(newErr);
            }
        });
    });

    /* ********************************* */
    // Route: POST /logins
    // Description: Get key
    //
    // Sample curl:
    // curl -i -X POST -H 'Content-Type: application/json' -d '{"username": "jpulgar", "password": "password"}' http://localhost:5000/logins
    /* ********************************* */
    app.post('/api/v1/logins', function (req, res, next) {

        User.findOne({
            'username': req.body.username
        }, function (err, user) {
            if (err) {
                return next(new Error(err.message));
            } else if (!user) {
                var newErr = new Error('User not found');
                newErr.status = 404;
                return next(newErr);
            } else {
                bcrypt.compare(req.body.password, user.password, function (err, doesMatch) {
                    if (doesMatch) {
                        if (user.level === 2) {
                            makeKey(user.level, user._id, user.directs, res);
                        } else if (user.level === 3) {
                            makeDirectorKey(user.level, user._id, user.directs, res);
                        } else {
                            makeKey(user.level, user._id, [], res);
                        }

                    } else {
                        var newErr = new Error('Incorrect password');
                        newErr.status = 401;
                        return next(newErr);
                    }
                });
            }
        });
    });

    app.get('/api/v1/logins/:key', function (req, res, next) {
        var newErr;

        if (req.params.key !== undefined) {
            Key.find({
                '_id': req.params.key
            }, function (err, key) {
                if (err) {
                    newErr = new Error('Not authorized');
                    newErr.status = 401;
                    return next(newErr);
                } else {
                    res.send(200);
                }
            });
        } else {
            newErr = new Error('Not authorized');
            newErr.status = 401;
            return next(newErr);
        }
    });

    // Error handling
    app.use(function (err, req, res, next) {
        if (err.status === 404) {
            res.jsonp(404, {
                error: err.message
            });
        } else if (err.status === 401) {
            res.jsonp(401, {
                error: err.message
            });
        } else if (err.status === 403) {
            res.jsonp(403, {
                error: err.message
            });
        } else {
            res.jsonp(500, {
                error: err.message
            });
        }

    });
};
