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
function myConsole(data) {
    "use strict";
    var logging = true;
    if (logging) {
        console.log(data);
    }
}

function checkAuth(req, res, next) {
    "use strict";
    if (req.query.key !== undefined) {
        Key.find({
            '_id': req.query.key
        }, function(err, result) {
            if (err) {
                res.jsonp(401, {
                    error: 'Not authorized'
                });
            } else if (!result.length) {
                res.jsonp(401, {
                    error: 'Not authorized'
                });
            } else {
                next();
            }
        });
    } else {
        res.jsonp(401, {
            error: 'Not authorized'
        });
    }
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
            'version': '1.0'
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
        User.find({}, 'name department jobTitle employeeType', function(err, users) {
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
        User.find({ name: regex }, 'name', function(err, users) {
            if (err) {
                myConsole('Error: GET /users/search/' + req.params.string);
                res.jsonp(500, {
                    error: err.name + ' - ' + err.message
                });
            } else {
                res.jsonp(users);
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

        // If multiple users requested, return basic info
        if (req.params.userid.length != 24) {
            User.find({
                '_id': {
                    $in: req.params.userid.split(",")
                }
            }, '-skills').lean().exec(function(err, user) {
                if (err) {
                    myConsole("Error: GET /users/" + req.params.userid);
                    myConsole(err);
                    res.jsonp(500, {
                        error: err.name + ' - ' + err.message
                    });
                } else if (!user.length) {
                    myConsole("Warning: GET /users/" + req.params.userid + " No results");
                    res.jsonp(404, {
                        error: 'No users found'
                    });
                } else {
                    myConsole("Successful: GET /users/" + req.params.userid);
                    res.jsonp(user);
                }
            });

            // If only one user requested, return more detailed information
        } else {
            User.find({
                '_id': req.params.userid
            }).lean().exec(function(err, user) {
                if (err) {
                    myConsole("Error: GET /users/" + req.params.userid);
                    myConsole(err);
                    res.jsonp(500, {
                        error: err.name + ' - ' + err.message
                    });
                } else if (!user.length) {
                    myConsole("Warning: GET /users/" + req.params.userid + " No results");
                    res.jsonp(404, {
                        error: 'No users found'
                    });
                } else {

                    // Get Departments
                    Department.find({
                        members: {
                            $in: [req.params.userid]
                        }
                    }).select('name').sort('name').lean().exec(function(err, departments) {
                        if (err) {
                            user[0].departments = err.name + ' - ' + err.message;
                        } else {
                            user[0].departments = departments;

                            // Get Projects
                            Project.find({
                                members: {
                                    $in: [req.params.userid]
                                }
                            }).select('name').sort('name').lean().exec(function(err, projects) {
                                if (err) {
                                    user[0].projects = err.name + ' - ' + err.message;
                                } else {
                                    user[0].projects = projects;
                                    myConsole("Successful: GET /users/" + req.params.userid);

                                    // If valid key, send skills
                                    if (req.query.key !== undefined) {
                                        Key.find({
                                            '_id': req.query.key
                                        }).lean().exec(function(err, result) {
                                            if (err) {
                                                delete user[0].skills;
                                                res.jsonp(user);
                                            } else if (!result.length) {
                                                delete user[0].skills;
                                                res.jsonp(user);
                                            } else {
                                                res.jsonp(user);
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
                }
            });
        }
    });



    /* ********************************* */
    // Route: POST /users
    // Description: Add a user. Validation happens at schema level
    //
    // Sample curl:
    // curl -i -X POST -H 'Content-Type: application/json' -d '{"name": "Billy Archibald", "jobTitle": "President"}' http://localhost:5000/users?key=532b0ded565784050ab40b02
    /* ********************************* */
    app.post('/users', checkAuth, function(req, res) {
        var myUser = new User(req.body);
        myUser.save(function(err) {
            if (err) {
                myConsole('Error: POST /users/ Unable to create user');
                res.jsonp(500, {
                    error: err.name + ' - ' + err.message,
                    more_info: 'name and jobTitle fields are required when creating a user'
                });
            } else {
                myConsole("Successful: POST /users/" + myUser._id);
                res.jsonp(myUser);
            }
        });
    });

    /* ********************************* */
    // Route: PUT /users/id
    // Description: Modify required user information. Validation happens at schema level.
    //
    // Sample curl:
    // curl -i -X PUT -H 'Content-Type: application/json' -d '{"name": "Nina Pulgar"}' http://localhost:5000/users/532b153bb1abf6610e011858?key=532b0ded565784050ab40b02
    /* ********************************* */
    app.put('/users/:userid', checkAuth, function(req, res) {
        var query = {
            _id: req.params.userid
        };

        User.update(query, {
            $set: req.body
        }, function(err, numberAffected, raw) {
            if (err) {
                myConsole('Error: PUT /users/' + req.params.userid);
                res.jsonp(500, {
                    error: err.name + ' - ' + err.message
                });
            } else {
                myConsole("Successful: PUT /users/" + req.params.userid);
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
    // curl -i -X PUT -H 'Content-Type: application/json' -d '[{"title": "HTML", "rating": "5.0"}, {"title": "CSS", "rating": "4.5"}]' http://localhost:5000/users/532b153bb1abf6610e011858/skills?key=532b0ded565784050ab40b02
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
                myConsole('Error: Unable to delete user skills!');
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
                myConsole('Error: PUT /users/' + req.params.userid + '/skills');
                res.jsonp(500, {
                    error: err.name + ' - ' + err.message
                });
            } else if (numberAffected) {
                myConsole('Success: PUT /users/' + req.params.userid + '/skills');
                res.jsonp({
                    'id': req.params.userid
                });
            } else {
                myConsole('Warning: PUT /users/' + req.params.userid + '/skills no rows affected!');
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
    // curl -i -X DELETE http://localhost:5000/users/5320b47c98c923ce106f094a
    /* ********************************* */
    app.delete('/users/:userid', checkAuth, function(req, res) {
        User.findByIdAndRemove(req.params.userid, function(err, resource) {
            if (err) {
                myConsole('Error: DELETE /users/' + req.params.userid);
                res.jsonp(500, {
                    error: err.name + ' - ' + err.message
                });
            } else if (resource) {
                myConsole('Success: DELETE /users/' + req.params.userid);
                res.jsonp({
                    message: 'User deleted'
                });

                // Now we need to delete from Departments/Projects/Tags
                Department.update({}, {
                    $pull: {
                        members: req.params.userid
                    }
                }, {
                    multi: true
                }, function(err, numberAffected, raw) {
                    if (err) {
                        myConsole('Error: Unable to delete ' + req.params.userid + ' from departments.');
                    }
                });
                Project.update({}, {
                    $pull: {
                        members: req.params.userid
                    }
                }, {
                    multi: true
                }, function(err, numberAffected, raw) {
                    if (err) {
                        myConsole('Error: Unable to delete ' + req.params.userid + ' from projects.');
                    }
                });
            } else {
                myConsole('Warning: DELETE /users/' + req.params.userid + ' User not found');
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
        Project.find({}, 'name', function(err, projects) {
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
                myConsole("Error: GET /projects/" + req.params.projectid);
                myConsole(err);
                res.jsonp(500, {
                    error: err.name + ' - ' + err.message
                });
            } else if (!project.length) {
                myConsole("Warning: GET /projects/" + req.params.projectid + " No results");
                res.jsonp(404, {
                    error: 'No projects found'
                });
            } else {
                myConsole("Successful: GET /projects/" + req.params.projectid);
                res.jsonp(project);
            }
        });
    });

    /* ********************************* */
    // Route: POST /projects
    // Description: Add a project. Validation done at schema level.
    //
    // Sample curl:
    // curl -i -X POST -H 'Content-Type: application/json' -d'{"name": "Baseball Cards", "status": "in progress"}' http://localhost:5000/projects?key=532b0ded565784050ab40b02
    /* ********************************* */
    app.post('/projects', checkAuth, function(req, res) {
        var myProject = new Project(req.body);
        myProject.save(function(err) {
            if (err) {
                myConsole('Error: POST /projects/ Unable to create project');
                res.jsonp(500, {
                    error: err.name + ' - ' + err.message
                });
            } else {
                myConsole("Successful: POST /projects/" + myProject._id);
                res.jsonp(myProject);
            }
        });
    });

    /* ********************************* */
    // Route: PUT /projects/id
    // Description: Modify required project information
    //
    // Sample curl:
    // curl -i -X PUT -H 'Content-Type: application/json' -d '{"name": "Baseball Cards Phase 2"}' http://localhost:5000/projects/531f6a31cf9b3bdb1580eef9
    /* ********************************* */
    app.put('/projects/:projectid', checkAuth, function(req, res) {
        var query = {
            _id: req.params.projectid
        };
        Project.update(query, {
            $set: req.body
        }, function(err, numberAffected, raw) {
            if (err) {
                myConsole('Error: PUT /projects/' + req.params.projectid);
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
    // curl -i -X PUT http://localhost:5000/projects/532a02a910536e2128234c8b/members/5329f663c43b5a461b507c5a?key=5329ce5315a953d40d7d3cd4
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
                myConsole('Error: PUT /projects/' + req.params.projectid + '/members');
                res.jsonp(500, {
                    error: err.name + ' - ' + err.message
                });
            } else if (numberAffected) {
                myConsole('Success: PUT /projects/' + req.params.projectid + '/members');
                res.jsonp({
                    'id': req.params.userid
                });
            } else {
                myConsole('Warning: PUT /projects/' + req.params.projectid + '/members Project not found!');
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
    // curl -i -X DELETE http://localhost:5000/projects/532a01c510536e2128234c8a/members/531f6a31cf9b3bdb1580eef9?key=5329ce5315a953d40d7d3cd4
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
                myConsole('Error: DELETE /projects/' + req.params.projectid + '/members/' + req.params.userid);
                res.jsonp(500, {
                    error: err.name + ' - ' + err.message
                });
            } else if (numberAffected) {
                myConsole('Success: DELETE /projects/' + req.params.projectid + '/members/' + req.params.userid);
                res.jsonp({
                    message: req.params.userid + ' removed from project'
                });
            } else {
                myConsole('Warning: DELETE /projects/' + req.params.projectid + '/members/' + req.params.userid + ' Project not found!');
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
    // curl -i -X DELETE http://localhost:5000/projects/532a01c510536e2128234c8a?key=5329ce5315a953d40d7d3cd4
    /* ********************************* */
    app.delete('/projects/:projectid', checkAuth, function(req, res) {
        Project.findByIdAndRemove(req.params.projectid, function(err, resource) {
            if (err) {
                myConsole('Error: DELETE /projects/' + req.params.projectid);
                res.jsonp(500, {
                    error: err.name + ' - ' + err.message
                });
            } else if (resource) {
                myConsole('Success: DELETE /projects/' + req.params.projectid);
                res.jsonp({
                    message: 'Project deleted'
                });
            } else {
                myConsole('Warning: DELETE /projects/' + req.params.projectid + ' Project not found');
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

        Login.findOne({
            'username': req.body.username
        }, function(err, user) {
            if (err) {
                myConsole("Error: POST /login");
                myConsole(err);
                res.jsonp(500, {
                    error: err.name + ' - ' + err.message
                });
            } else if (!user) {
                myConsole("Warning: POST /login User does not exist");
                res.jsonp(404, {
                    error: 'User does not exist'
                });
            } else {
                bcrypt.compare(req.body.password, user.password, function(err, doesMatch) {
                    if (doesMatch) {
                        var myKey = new Key({
                            'level': user.level
                        });
                        myKey.save(function(err) {
                            if (err) {
                                myConsole('Error: Unable to save key');
                                res.jsonp(500, {
                                    error: err.name + ' - ' + err.message
                                });
                            } else {
                                myConsole('Successful: Valid key sent');
                                res.jsonp({
                                    'key': myKey._id
                                });
                            }
                        });
                    } else {
                        myConsole("Error: POST /login Incorrect password");
                        res.jsonp(500, {
                            error: 'Incorrect password'
                        });
                    }
                });
            }
        });
    });


};
