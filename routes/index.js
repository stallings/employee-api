/* ********************************* */
// Load Models
/* ********************************* */
var User = require('../models/user');
var Project = require('../models/project');
var Login = require('../models/login');
var Key = require('../models/key');
var bcrypt = require('bcrypt');


/* ********************************* */
// Helper Functions
/* ********************************* */
function checkAuth(req, res, next) {
    "use strict";
    if (req.query.key !== undefined) {
        Key.find({
            '_id': req.query.key
        }, function(err, key) {
            if (err) {
                res.jsonp(401, {
                    error: 'Not authorized'
                });
            } else if (!key.length) {
                res.jsonp(401, {
                    error: 'Not authorized'
                });
            } else {
                // If we are VP, we are always authorized
                if (key[0].level === 4) {
                    next();

                    // If we are Director/Manager
                } else if ((key[0].level === 2) || (key[0].level === 3)) {

                    // If no userid is passed, we are creating project/user (allow)
                    if (req.params.userid === undefined) {
                        next();

                    } else {
                        // Allow trying to edit/delete a direct report only
                        if (key[0].edit.indexOf(req.params.userid) !== -1) {
                            next();
                        } else {
                            res.jsonp(401, {
                                error: 'Not authorized. User is not a direct report.'
                            });
                        }
                    }

                    // Regular users are not allowed to edit anything
                } else {
                    res.jsonp(401, {
                        error: 'Not authorized. Regular users not allowed to edit.'
                    });
                }
            }
        });
    } else {
        res.jsonp(401, {
            error: 'Not authorized'
        });
    }
}

// Makes a key
function makeKey(level, user, directs, res) {
    "use strict";
    var myKey = new Key({
        'level': level,
        'self': user,
        'edit': directs
    });
    myKey.save(function(err) {
        if (err) {
            res.jsonp(500, {
                error: err.name + ' - ' + err.message
            });
        } else {
            res.jsonp({
                'key': myKey._id
            });
        }
    });
}

// For Director level - Finds 2 levels of direct reports
function getSubDirects(level, user, myUsers, res) {
    "use strict";
    User.find({
        _id: {
            $in: myUsers
        }
    }, 'directs', function(err, users) {
        for (var i = 0; i < users.length; i++) {
            for (var j = 0; j < users[i].directs.length; j++) {
                myUsers.push(users[i].directs[j]);
            }
        }
        makeKey(level, user, myUsers, res);
    });
}


/* ********************************* */
// Export Routes
/* ********************************* */
module.exports = function(app) {
    "use strict";
    /* ********************************* */
    // Route: GET /
    // Description: Returns the UX API version
    //
    // Sample curl:
    // curl -i -X GET http://localhost:5000/
    /* ********************************* */
    app.get('/', function(req, res) {
        res.jsonp({
            'version': '0.0.1'
        });
    });


    /* ********************************* */
    // Route: GET /users
    // Description: Get all user names and IDs
    //
    // Sample curl:
    // curl -i -X GET http://localhost:5000/users
    /* ********************************* */
    app.get('/users', function(req, res) {
        User.find({}, 'department jobTitle employeeType', function(err, users) {
            res.jsonp(users);
        });
    });

    /* ********************************* */
    // Route: GET /users/search/string
    // Description: Get all names that contain the string
    //
    // Sample curl:
    // curl -i -X GET http://localhost:5000/users/search/string
    /* ********************************* */
    app.get('/users/search/:string', function(req, res) {
        var regex = new RegExp(req.params.string, 'i');
        User.find({
            _id: regex
        }, '_id', function(err, users) {
            if (err) {
                res.jsonp(500, {
                    error: err.name + ' - ' + err.message
                });
            } else {
                res.jsonp(users);
            }
        });
    });

    /* ********************************* */
    // Route: GET /users/orgchart/string
    // Description: Get Org Chart
    //
    // Sample curl:
    // curl -i -X GET http://localhost:5000/users/orgchart/userid
    /* ********************************* */
    app.post('/users/orgchart/:userid', function(req, res) {

        User.findOne({
            '_id': req.params.userid
        }, function(err, user) {
            if (err) {
                res.jsonp(500, {
                    error: err.name + ' - ' + err.message
                });
            } else if (!user) {
                res.jsonp(404, {
                    error: 'User does not exist'
                });
            } else {
                // Make array based on the data we have Manager -> Me -> Directs
                if (user.level === 2) {
                    /*
[{v:'Mike', f:'Mike<br/>President'}, ''],
[{v:'Jim', f:'Jim<br/>Vice President'}, 'Mike'],
['Alice', 'Mike'],
['Bob', 'Jim'],
['Carol', 'Bob']
*/
                    // Get additional information Manager -> Me -> Directs
                } else if (user.level === 3) {
                    getSubDirects(user.level, user._id, user.directs, res);
                    // Get additional information Manager -> Me (with other directs)
                } else {
                    makeKey(user.level, user._id, [], res);
                }

                /* Target:
                [{v:'Mike', f:'Mike<br/>President'}, ''],
                [{v:'Jim', f:'Jim<br/>Vice President'}, 'Mike'],
                ['Alice', 'Mike'],
                ['Bob', 'Jim'],
                ['Carol', 'Bob']
          */
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
    app.get('/users/:userid', function(req, res) {

        // If multiple users requested, return info for each (less than individual)
        if (req.params.userid.indexOf(',') != -1) {
            User.find({
                '_id': {
                    $in: req.params.userid.split(",")
                }
            }, '-skills').lean().exec(function(err, user) {
                if (err) {
                    res.jsonp(500, {
                        error: err.name + ' - ' + err.message
                    });
                } else if (!user.length) {
                    res.jsonp(404, {
                        error: 'No users found'
                    });
                } else {
                    res.jsonp(user);
                }
            });

            // If only one user requested, return more detailed information
        } else {
            User.find({
                '_id': req.params.userid
            }).lean().exec(function(err, user) {
                if (err) {
                    res.jsonp(500, {
                        error: err.name + ' - ' + err.message
                    });
                } else if (!user.length) {
                    res.jsonp(404, {
                        error: 'No users found'
                    });
                } else {

                    // If valid key, send skills
                    if (req.query.key !== undefined) {
                        Key.find({
                            '_id': req.query.key
                        }).lean().exec(function(err, key) {
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
    // curl -i -X POST -H 'Content-Type: application/json' -d '{"_id": "Billy Archibald", "jobTitle": "President"}' http://localhost:5000/users?key=532b0ded565784050ab40b02
    /* ********************************* */
    app.post('/users', checkAuth, function(req, res) {
        var myUser = new User(req.body);
        myUser.save(function(err) {
            if (err) {
                res.jsonp(500, {
                    error: err.name + ' - ' + err.message
                });
            } else {
                res.jsonp(myUser);
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
    app.put('/users/:userid', checkAuth, function(req, res) {
        var query = {
            _id: req.params.userid
        };

        User.update(query, {
            $set: req.body
        }, function(err, numberAffected, raw) {
            if (err) {
                res.jsonp(500, {
                    error: err.name + ' - ' + err.message
                });
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
    app.put('/users/:userid/skills', checkAuth, function(req, res) {
        var query = {
            _id: req.params.userid
        };

        // Remove other skills
        User.update(query, {
            $set: {
                skills: []
            }
        }, function(err) {
            if (err) {
                res.jsonp(500, {
                    error: 'Unable to delete user skills'
                });
            }
        });

        // Add all skills
        User.update(query, {
            $addToSet: {
                skills: {
                    $each: req.body
                }
            }
        }, function(err, numberAffected, raw) {
            if (err) {
                res.jsonp(500, {
                    error: err.name + ' - ' + err.message
                });
            } else if (numberAffected) {
                res.jsonp({
                    'id': req.params.userid
                });
            } else {
                res.jsonp(500, {
                    error: 'No rows affected'
                });
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
    app.delete('/users/:userid', checkAuth, function(req, res) {
        User.findByIdAndRemove(req.params.userid, function(err, resource) {
            if (err) {
                res.jsonp(500, {
                    error: err.name + ' - ' + err.message
                });
            } else if (resource) {
                res.jsonp({
                    message: 'User deleted'
                });
            } else {
                res.jsonp(404, {
                    error: 'User not found'
                });
            }
        });
    });



    /* --------------------------------------------------------------------------------------------------- */

    /* ********************************* */
    // Route: GET /projects
    // Description: Get all project names and IDs
    //
    // Sample curl:
    // curl -i -X GET http://localhost:5000/projects
    /* ********************************* */
    app.get('/projects', function(req, res) {
        Project.find({}, '_id', function(err, projects) {
            res.jsonp(projects);
        });
    });

    /* ********************************* */
    // Route: GET /projects/id,id
    // Description: Get one or more projects
    //
    // Sample curl:
    // curl -i -X GET http://localhost:5000/projects/id,id
    /* ********************************* */
    app.get('/projects/:projectid', function(req, res) {
        Project.find({
            '_id': {
                $in: req.params.projectid.split(",")
            }
        }, function(err, project) {
            if (err) {
                res.jsonp(500, {
                    error: err.name + ' - ' + err.message
                });
            } else if (!project.length) {
                res.jsonp(404, {
                    error: 'No projects found'
                });
            } else {
                res.jsonp(project);
            }
        });
    });

    /* ********************************* */
    // Route: POST /projects
    // Description: Add a project. Validation done at schema level.
    //
    // Sample curl:
    // curl -i -X POST -H 'Content-Type: application/json' -d'{"_id": "Baseball Cards", "status": "in progress"}' http://localhost:5000/projects?key=53442478daec93cb0a30dd1a
    /* ********************************* */
    app.post('/projects', checkAuth, function(req, res) {
        var myProject = new Project(req.body);
        myProject.save(function(err) {
            if (err) {
                res.jsonp(500, {
                    error: err.name + ' - ' + err.message
                });
            } else {
                res.jsonp(myProject);
            }
        });
    });

    /* ********************************* */
    // Route: PUT /projects/id
    // Description: Modify required project information
    //
    // Sample curl:
    // curl -i -X PUT -H 'Content-Type: application/json' -d '{"description": "Another fashion project"}' http://localhost:5000/projects/Kmart%20Fashion/?key=53442478daec93cb0a30dd1a
    /* ********************************* */
    app.put('/projects/:projectid', checkAuth, function(req, res) {
        var query = {
            _id: req.params.projectid
        };
        Project.update(query, {
            $set: req.body
        }, function(err, numberAffected, raw) {
            if (err) {
                res.jsonp(500, {
                    error: err.name + ' - ' + err.message
                });
            } else {
                res.jsonp({
                    'id': req.params.projectid
                });
            }
        });
    });

    /* ********************************* */
    // Route: PUT /projects/id/members/id
    // Description: Add a user to a project
    //
    // Sample curl:
    // curl -i -X PUT http://localhost:5000/projects/Kmart%20Fashion/members/Nina%20Pulgar?key=53442478daec93cb0a30dd1a
    /* ********************************* */
    app.put('/projects/:projectid/members/:userid', checkAuth, function(req, res) {
        var query = {
            _id: req.params.projectid
        };

        Project.update(query, {
            $addToSet: {
                members: req.params.userid
            }
        }, function(err, numberAffected, raw) {
            if (err) {
                res.jsonp(500, {
                    error: err.name + ' - ' + err.message
                });
            } else if (numberAffected) {
                res.jsonp({
                    'id': req.params.userid
                });
            } else {
                res.jsonp(404, {
                    error: 'Project not found'
                });
            }
        });
    });

    /* ********************************* */
    // Route: DELETE /projects/id/members/id
    // Description: Remove a user from a project
    //
    // Sample curl:
    // curl -i -X DELETE http://localhost:5000/projects/Kmart%20Fashion/members/Nina%20Pulgar?key=53442478daec93cb0a30dd1a
    /* ********************************* */
    app.delete('/projects/:projectid/members/:userid', checkAuth, function(req, res) {
        var query = {
            _id: req.params.projectid
        };

        Project.update(query, {
            $pull: {
                members: req.params.userid
            }
        }, function(err, numberAffected, raw) {
            if (err) {
                res.jsonp(500, {
                    error: err.name + ' - ' + err.message
                });
            } else if (numberAffected) {
                res.jsonp({
                    message: req.params.userid + ' removed from project'
                });
            } else {
                res.jsonp(404, {
                    error: 'Project not found'
                });
            }
        });
    });

    /* ********************************* */
    // Route: DELETE /projects/id
    // Description: Delete a Project
    //
    // Sample curl:
    // curl -i -X DELETE http://localhost:5000/projects/Kmart%20Fashion?key=53442478daec93cb0a30dd1a
    /* ********************************* */
    app.delete('/projects/:projectid', checkAuth, function(req, res) {
        Project.findByIdAndRemove(req.params.projectid, function(err, resource) {
            if (err) {
                res.jsonp(500, {
                    error: err.name + ' - ' + err.message
                });
            } else if (resource) {
                res.jsonp({
                    message: 'Project deleted'
                });
            } else {
                res.jsonp(404, {
                    error: 'Project not found'
                });
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
    app.post('/logins', function(req, res) {

        User.findOne({
            'username': req.body.username
        }, function(err, user) {
            if (err) {
                res.jsonp(500, {
                    error: err.name + ' - ' + err.message
                });
            } else if (!user) {
                res.jsonp(404, {
                    error: 'User does not exist'
                });
            } else {
                bcrypt.compare(req.body.password, user.password, function(err, doesMatch) {
                    if (doesMatch) {

                        if (user.level === 2) {
                            makeKey(user.level, user._id, user.directs, res);
                        } else if (user.level === 3) {
                            getSubDirects(user.level, user._id, user.directs, res);
                        } else {
                            makeKey(user.level, user._id, [], res);
                        }

                    } else {
                        res.jsonp(500, {
                            error: 'Incorrect password'
                        });
                    }
                });
            }
        });
    });


};
