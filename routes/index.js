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
                return next(new Error(err.message));
            } else if (!key.length) {
                var err = new Error('Not authorized');
                err.status = 401;
                return next(err);
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
                            var err = new Error('Forbidden. User is not a direct report.');
                            err.status = 403;
                            return next(err);
                        }
                    }

                    // Regular users are not allowed to edit anything
                } else {
                    var err = new Error('Forbidden. User is not a direct report.');
                    err.status = 403;
                    return next(err);
                }
            }
        });
    } else {
        var err = new Error('Not authorized');
        err.status = 401;
        return next(err);
    }
}

// Makes a key
function makeKey(level, user, directs, req, res, next) {
    "use strict";
    var myKey = new Key({
        'level': level,
        'self': user,
        'edit': directs
    });
    myKey.save(function(err) {
        if (err) {
            res.jsonp(500, {
                error: err.message
            });
        } else {
            res.jsonp({
                'key': myKey._id
            });
        }
    });
}

// For Director level - Finds 2 levels of direct reports
function getSubDirects(level, user, myUsers, req, res, next) {
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
        makeKey(level, user, myUsers, req, res, next);
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
    app.get('/', function(req, res, next) {
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
    app.get('/users', function(req, res, next) {
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
    app.get('/users/search/:string', function(req, res, next) {
        var regex = new RegExp(req.params.string, 'i');
        User.find({
            _id: regex
        }, '_id', function(err, users) {
            if (err) {
                return next(new Error(err.message));
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
    app.get('/users/orgchart/:userid', function(req, res, next) {


    // VP = 4, Director = 3, Manager = 2, General User = 1
        User.findOne({
            '_id': req.params.userid
        }, function(err, user) {
            if (err) {
                return next(new Error(err.message));
            } else if (!user) {
                var err = new Error('User does not exist');
                err.status = 404;
                return next(err);
            } else {

                if (user.level < 4) {

                    // Get the titles of manager and direct reports
                    var idsToSearch = Array.prototype.concat(user.manager, user.directs);

                    User.find({
                        '_id': {
                            $in: idsToSearch
                        }
                    }, 'title').lean().exec(function(err, userTitles) {
                        if (err) {
                            return next(new Error(err.message));
                        } else if (!userTitles.length) {
                            var err = new Error('No users titles found');
                            err.status = 404;
                            return next(err);
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
                            }]
                        }];

                        for (var i = 0; i < user.directs.length; i++) {
                            orgChartData[0].children[0].children.push( {name: user.directs[i] + "|" + nameAndTitles[user.directs[i]], parent: user._id + "|" + user.title } );
                        }
                        res.jsonp(orgChartData);
                        }
                    });


                }
            }
        });
    });
                /*

                    User.find({
                        '_id': {
                            $in: req.params.userid.split(",")
                        }
                    }, '-skills').lean().exec(function(err, user) {
                        if (err) {
                            return next(new Error(err.message));
                        } else if (!user.length) {
                            var err = new Error('No users found');
                            err.status = 404;
                            return next(err);
                        } else {
                            res.jsonp(user);
                        }
                    });


                // Get titles and populate in array
                // myArray["Matt Danforth"] = "Director";

                // Fill in the data

                // function sendOrgChart(arrayOfPeople, object)

                var treeData = [
                {
                    name: "Matt Danforth",
                    parent: "null",
                    children: [
                        {
                        name: "Jose Pulgar|Manager",
                        parent: "Matt Danforth",
                        children: [
                        {
                            name: "Rob Philibert",
                            parent: "Jose Pulgar|Manager"
                        },
                        {
                            name: "Yanti Arifin",
                            parent: "Jose Pulgar|Manager"
                        },
                        {
                            name: "Robbin Farrell",
                            parent: "Jose Pulgar|Manager"
                        },
                        {
                            name: "Ryan Lutterbach",
                            parent: "Jose Pulgar|Manager"
                        }
                        ]
                    }]
                }];

/*


managerdirectorObj =
[
{
    name: "Jose Pulgar|Manager",
    parent: "Matt Danforth",
    children: [
    {
        name: "Felix Jung",
        parent: "Jose Pulgar|Manager"
    },
    {
        name: "Lindsey Snyder",
        parent: "Jose Pulgar|Manager"
    },
    {
        name: "Maureen Vana",
        parent: "Jose Pulgar|Manager"
    }

    ]
}]

generalObj =
[
{
    name: "Jose Pulgar|Manager",
    parent: "Matt Danforth"
}]
*/



                    /*
[{v:'Mike', f:'Mike<br/>President'}, ''],
[{v:'Jim', f:'Jim<br/>Vice President'}, 'Mike'],
['Alice', 'Mike'],
['Bob', 'Jim'],
['Carol', 'Bob']

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



    /* ********************************* */
    // Route: GET /users/id,id
    // Description: Get one or more users
    //
    // Sample curl:
    // curl -i -X GET http://localhost:5000/users/id,id
    /* ********************************* */
    app.get('/users/:userid', function(req, res, next) {

        // If multiple users requested, return info for each (less than individual)
        if (req.params.userid.indexOf(',') != -1) {
            User.find({
                '_id': {
                    $in: req.params.userid.split(",")
                }
            }, '-skills').lean().exec(function(err, user) {
                if (err) {
                    return next(new Error(err.message));
                } else if (!user.length) {
                    var err = new Error('No users found');
                    err.status = 404;
                    return next(err);
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
                    return next(new Error(err.message));
                } else if (!user.length) {
                    var err = new Error('No users found');
                    err.status = 404;
                    return next(err);
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
    // curl -i -X POST -H 'Content-Type: application/json' -d '{"_id": "Billy Archibald7", "username": "billy", "level": 3}' http://localhost:5000/users?key=5351402ea096c331093a8e0f
    /* ********************************* */
    app.post('/users', checkAuth, function(req, res, next) {
        var myUser = new User(req.body);
        myUser.save(function(err) {
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
    app.put('/users/:userid', checkAuth, function(req, res) {
        var query = {
            _id: req.params.userid
        };

        User.update(query, {
            $set: req.body
        }, function(err, numberAffected, raw) {
            if (err) {
                return next(new Error(err.message));
            } else {

                // If title changed, change the title in all manager cards
                // var query = { Zip: new RegExp('^' + zipCode) };
                // db.users.find( { directs: { $in: [ /^req.params.userid/] } } )
                // db.users.find( { directs: { /^Man/ } } )

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
    app.put('/users/:userid/skills', checkAuth, function(req, res, next) {
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
        }, function(err, numberAffected, raw) {
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
    app.delete('/users/:userid', checkAuth, function(req, res, next) {
        User.findByIdAndRemove(req.params.userid, function(err, resource) {
            if (err) {
                return next(new Error(err.message));
            } else if (resource) {
                res.send(204);
            } else {
                var err = new Error('User not found');
                err.status = 404;
                return next(err);
            }
        });
    });

    /* ********************************* */
    // Route: GET /projects
    // Description: Get all project names and IDs
    //
    // Sample curl:
    // curl -i -X GET http://localhost:5000/projects
    /* ********************************* */
    app.get('/projects', function(req, res, next) {
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
    app.get('/projects/:projectid', function(req, res, next) {
        Project.find({
            '_id': {
                $in: req.params.projectid.split(",")
            }
        }, function(err, project) {
            if (err) {
                return next(new Error(err.message));
            } else if (!project.length) {
                var err = new Error('Project not found');
                err.status = 404;
                return next(err);
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
    app.post('/projects', checkAuth, function(req, res, next) {
        var myProject = new Project(req.body);
        myProject.save(function(err) {
            if (err) {
                return next(new Error(err.message));
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
    app.put('/projects/:projectid', checkAuth, function(req, res, next) {
        var query = {
            _id: req.params.projectid
        };
        Project.update(query, {
            $set: req.body
        }, function(err, numberAffected, raw) {
            if (err) {
                return next(new Error(err.message));
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
    app.put('/projects/:projectid/members/:userid', checkAuth, function(req, res, next) {
        var query = {
            _id: req.params.projectid
        };

        Project.update(query, {
            $addToSet: {
                members: req.params.userid
            }
        }, function(err, numberAffected, raw) {
            if (err) {
                return next(new Error(err.message));
            } else if (numberAffected) {
                res.jsonp({
                    'id': req.params.userid
                });
            } else {
                var err = new Error('Project not found');
                err.status = 404;
                return next(err);
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
    app.delete('/projects/:projectid/members/:userid', checkAuth, function(req, res, next) {
        var query = {
            _id: req.params.projectid
        };

        Project.update(query, {
            $pull: {
                members: req.params.userid
            }
        }, function(err, numberAffected, raw) {
            if (err) {
                return next(new Error(err.message));
            } else if (numberAffected) {
                res.send(204);
            } else {
                var err = new Error('Project not found');
                err.status = 404;
                return next(err);
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
    app.delete('/projects/:projectid', checkAuth, function(req, res, next) {
        Project.findByIdAndRemove(req.params.projectid, function(err, resource) {
            if (err) {
                return next(new Error(err.message));
            } else if (resource) {
                res.send(204);
            } else {
                var err = new Error('Project not found');
                err.status = 404;
                return next(err);
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
    app.post('/logins', function(req, res, next) {

        User.findOne({
            'username': req.body.username
        }, function(err, user) {
            if (err) {
                return next(new Error(err.message));
            } else if (!user) {
                var err = new Error('User not found');
                err.status = 404;
                return next(err);
            } else {
                bcrypt.compare(req.body.password, user.password, function(err, doesMatch) {
                    if (doesMatch) {
                        if (user.level === 2) {
                            makeKey(user.level, user._id, user.directs, req, res, next);
                        } else if (user.level === 3) {
                            getSubDirects(user.level, user._id, user.directs, req, res, next);
                        } else {
                            makeKey(user.level, user._id, [], req, res, next);
                        }

                    } else {
                        var err = new Error('Incorrect password');
                        err.status = 401;
                        return next(err);
                    }
                });
            }
        });
    });

    // Error handling
    app.use(function(err, req, res, next) {
        if (err.status === 404) {
            res.jsonp(404, { error: err.message });
        } else if (err.status === 401) {
            res.jsonp(401, { error: err.message });
        } else if (err.status === 403) {
            res.jsonp(403, { error: err.message });
        } else {
            res.jsonp(500, { error: err.message });
        }

    });
};
