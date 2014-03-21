/* 
Todo:
- Add Tags model (ASAP/PDP), tags can have members so you can easily see the people with those skills

Future:
- Org chart: who is manager, who are direct reports
*/

// Requires
var express = require('express');
var mongoose = require('mongoose');
var bcrypt = require('bcrypt');

var app = express();

// Removed following line to avoid: connect.multipart() will be removed in connect 3.0
//app.use(express.bodyParser());

// Replaced with following according to: https://github.com/senchalabs/connect/wiki/Connect-3.0
app.use(express.urlencoded());
app.use(express.json());

/* ********************************* */
// Add Models
/* ********************************* */
var User = require('./models/user');
var Department = require('./models/department');
var VTeam = require('./models/vteam');
var Login = require('./models/login');
var Key = require('./models/key');

/* ********************************* */
// Debugging
/* ********************************* */
function myConsole(data) {
    var logging = true;
    if (logging) {
        console.log(data);   
    }
}

// Modify this later by passing a level number, add it at the end???
function checkAuth(req, res, next) {
    if (req.query.key != undefined) {
      Key.find({'_id': req.query.key}, function(err, result){
            if (err) {
                res.jsonp(401, { error: 'Not authorized' });
            } else if (!result.length) {
                res.jsonp(401, { error: 'Not authorized' });
            } else {
                next();
            }
        });
    } else {
      res.jsonp(401, { error: 'Not authorized' });
    }
}

/* ********************************* */
// Connect to MongoDB
/* ********************************* */
mongoose.connect( 'mongodb://localhost/baseball', function(err) { 
    if (err) myConsole('Error: Unable to connect to MongoDB!');
});

/* ********************************* */
// Route: GET /
// Description: Returns the UX API version
//
// Sample curl:
// curl -i -X GET http://localhost:5000/
/* ********************************* */
app.get('/', function(req, res) {
  res.jsonp({'version' : '1.0'});
});


/* ********************************* */
// Route: GET /users
// Description: Get all user names and IDs
//
// Sample curl:
// curl -i -X GET http://localhost:5000/users
/* ********************************* */
app.get('/users', function(req, res) {
  User.find({}, 'name', function(err, users) {
     res.jsonp(users);
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
            User.find({'_id': { $in: req.params.userid.split(",")}}, '-skills').lean().exec(function(err, user){
                if (err) {
                    myConsole("Error: GET /users/" + req.params.userid);
                    myConsole(err);
                    res.jsonp(500, { error: err.name + ' - ' + err.message });
                } else if (!user.length) { 
                    myConsole("Warning: GET /users/" + req.params.userid + " No results");
                    res.jsonp(404, { error: 'No users found' });
                } else {
                    myConsole("Successful: GET /users/" + req.params.userid);
                    res.jsonp(user);
                }
            });
    
    // If only one user requested, return more detailed information
    } else {
        User.find({'_id': req.params.userid}).lean().exec(function(err, user){
            if (err) {
                myConsole("Error: GET /users/" + req.params.userid);
                myConsole(err);
                res.jsonp(500, { error: err.name + ' - ' + err.message });
            } else if (!user.length) { 
                myConsole("Warning: GET /users/" + req.params.userid + " No results");
                res.jsonp(404, { error: 'No users found' });
            } else {

                // Get Departments
                Department.find({members: { $in : [req.params.userid] }}).select('name').sort('name').lean().exec(function (err, departments) {
                    if (err) { 
                        user[0].departments = err.name + ' - ' + err.message;
                    } else {
                        user[0].departments = departments;

                        // Get VTeams
                        VTeam.find({members: { $in : [req.params.userid] }}).select('name').sort('name').lean().exec(function (err, vteams) {
                            if (err) { 
                                user[0].vteams = err.name + ' - ' + err.message;
                            } else {
                                user[0].vteams = vteams;
                                myConsole("Successful: GET /users/" + req.params.userid);

                                // If valid key, send skills
                                if (req.query.key != undefined) {
                                    Key.find({'_id': req.query.key}).lean().exec(function(err, result){
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
    myUser.save(function (err) {
    if (err) {
        myConsole('Error: POST /users/ Unable to create user');
        res.jsonp(500, { error: err.name + ' - ' + err.message, more_info: 'name and jobTitle fields are required when creating a user'});
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
    var query = { _id: req.params.userid };

    User.update(query, req.body, function (err, numberAffected, raw) {
        if (err) {
            myConsole('Error: PUT /users/' + req.params.userid);
            res.jsonp(500, { error: err.name + ' - ' + err.message });
        } else {
            myConsole("Successful: PUT /users/" + req.params.userid);
            res.jsonp({'id' : req.params.userid});
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
    var query = { _id: req.params.userid };

    // Remove other skills
    User.update(query, {$set: { skills: [] }}, function (err) {
       if (err) { 
           myConsole('Error: Unable to delete user skills!');
           res.jsonp(500, { error: 'Unable to delete user skills' });
       } 
    });
    
    // Add all skills
    User.update(query, {$addToSet : { skills: { $each: req.body } }}, function (err, numberAffected, raw) {
        if (err) {
            myConsole('Error: PUT /users/' + req.params.userid + '/skills');
            res.jsonp(500, { error: err.name + ' - ' + err.message });
        } else if (numberAffected) {
            myConsole('Success: PUT /users/' + req.params.userid + '/skills');
            res.jsonp({'id' : req.params.userid});
        } else {
            myConsole('Warning: PUT /users/' + req.params.userid + '/skills no rows affected!');
            res.jsonp(500, { error: 'No rows affected' });
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
    User.findByIdAndRemove(req.params.userid, function (err, resource) {
        if (err) { 
            myConsole('Error: DELETE /users/' + req.params.userid);
            res.jsonp(500, { error: err.name + ' - ' + err.message });
        } else if (resource) {
            myConsole('Success: DELETE /users/' + req.params.userid);
            res.jsonp({ message: 'User deleted' });
            
            // Now we need to delete from Departments/VTeams/Tags
            Department.update({}, {$pull: { members: req.params.userid}}, {multi: true}, function (err, numberAffected, raw) {
                if (err) {
                    myConsole('Error: Unable to delete ' + req.params.userid + ' from departments.');
                }
            });
            VTeam.update({}, {$pull: { members: req.params.userid}}, {multi: true}, function (err, numberAffected, raw) {
                if (err) {
                    myConsole('Error: Unable to delete ' + req.params.userid + ' from vteams.');
                }
            });
        } else {
            myConsole('Warning: DELETE /users/' + req.params.userid + ' User not found');
            res.jsonp(404, { error: 'User not found' });
        }
    });
});



/* --------------------------------------------------------------------------------------------------- */



/* ********************************* */
// Route: GET /departments
// Description: Get all department names and IDs
//
// Sample curl:
// curl -i -X GET http://localhost:5000/departments
/* ********************************* */
app.get('/departments', function(req, res) {
  Department.find({}, 'name', function(err, departments) {
     res.jsonp(departments);
  });
});

/* ********************************* */
// Route: GET /departments/id,id
// Description: Get one or more departments
//
// Sample curl:
// curl -i -X GET http://localhost:5000/departments/id,id
/* ********************************* */
app.get('/departments/:departmentid', function(req, res) {
    Department.find({
    '_id': { $in: req.params.departmentid.split(",")}}, function(err, department){
        if (err) {
            myConsole("Error: GET /departments/" + req.params.departmentid);
            myConsole(err);
            res.jsonp(500, { error: err.name + ' - ' + err.message });
        } else if (!department.length) { 
            myConsole("Warning: GET /departments/" + req.params.departmentid + " No results");
            res.jsonp(404, { error: 'No departments found' });
        } else {
            myConsole("Successful: GET /departments/" + req.params.departmentid);
            res.jsonp(department);
        }
    });    
});

/* ********************************* */
// Route: POST /departments
// Description: Add a department
//
// Sample curl:
// curl -i -X POST -H 'Content-Type: application/json' -d '{"name": "Project Managers"}' http://localhost:5000/departments?key=532b0ded565784050ab40b02
/* ********************************* */
app.post('/departments', checkAuth, function(req, res) {
    var myDepartment = new Department(req.body);
    myDepartment.save(function (err) {
        if (err) {
            myConsole('Error: POST /departments/ Unable to create department');
            res.jsonp(500, { error: err.name + ' - ' + err.message });
        } else {
            myConsole("Successful: POST /departments/" + myDepartment._id);
            res.jsonp(myDepartment);
        }
    });
});

/* ********************************* */
// Route: PUT /departments/id
// Description: Modify required department information
//
// Sample curl:
// curl -i -X PUT -H 'Content-Type: application/json' -d '{"name": "Front End Developers"}' http://localhost:5000/departments/531f6a31cf9b3bdb1580eef9
/* ********************************* */
app.put('/departments/:departmentid', checkAuth, function(req, res) {
    var query = { _id: req.params.departmentid };
    Department.update(query, req.body, function (err, numberAffected, raw) {
        if (err) {
            myConsole('Error: PUT /departments/' + req.params.departmentid);
            res.jsonp(500, { error: err.name + ' - ' + err.message });
        } else {
            myConsole("Successful: PUT /departments/" + req.params.departmentid);
            res.jsonp({'id' : req.params.departmentid});
        }
    });
});

/* ********************************* */
// Route: PUT /departments/id/members/id
// Description: Add a user to a department
//
// Sample curl:
// curl -i -X PUT http://localhost:5000/departments/532a010810536e2128234c89/members/5329f663c43b5a461b507c5a?key=5329ce5315a953d40d7d3cd4
/* ********************************* */
app.put('/departments/:departmentid/members/:userid', checkAuth, function(req, res) {
    var query = { _id: req.params.departmentid };

    Department.update(query, { $addToSet: { members: req.params.userid } }, function (err, numberAffected, raw) {
        if (err) {
           myConsole('Error: PUT /departments/' + req.params.departmentid + '/members');
           res.jsonp(500, { error: err.name + ' - ' + err.message });
        } else if (numberAffected) {
            myConsole('Success: PUT /departments/' + req.params.departmentid + '/members');
            res.jsonp({'id' : req.params.userid});
        } else {
            myConsole('Warning: PUT /departments/' + req.params.departmentid + '/members Department not found!');
            res.jsonp(404, { error: 'Department not found' });
        }
    });
});

/* ********************************* */
// Route: DELETE /departments/id/members/id
// Description: Remove a user from a department
//
// Sample curl:
// curl -i -X DELETE http://localhost:5000/departments/531a2875e454ce0ad42d6465/members/531f6a31cf9b3bdb150eef8?key=5329ce5315a953d40d7d3cd4
/* ********************************* */
app.delete('/departments/:departmentid/members/:userid', checkAuth, function(req, res) {
    var query = { _id: req.params.departmentid };

    Department.update(query, { $pull: { members: req.params.userid } }, function (err, numberAffected, raw) {
        if (err) {
           myConsole('Error: DELETE /departments/' + req.params.departmentid + '/members/' + req.params.userid);
           res.jsonp(500, { error: err.name + ' - ' + err.message });
        } else if (numberAffected) {
            myConsole('Success: DELETE /departments/' + req.params.departmentid + '/members/' + req.params.userid);
            res.jsonp({'id' : req.params.userid});
        } else {
            myConsole('Warning: DELETE /departments/' + req.params.departmentid + '/members/'  + req.params.userid + ' Department not found!');
            res.jsonp(404, { error: 'Department not found' });
        }
    });
});

/* ********************************* */
// Route: DELETE /departments/id
// Description: Delete a department
//
// Sample curl:
// curl -i -X DELETE http://localhost:5000/departments/5321ed85b1d521421389276e
/* ********************************* */
app.delete('/departments/:departmentid', checkAuth, function(req, res) {
    Department.findByIdAndRemove(req.params.departmentid, function (err, resource) {
        if (err) { 
            myConsole('Error: DELETE /departments/' + req.params.departmentid);
            res.jsonp(500, { error: err.name + ' - ' + err.message });
        } else if (resource) {
            myConsole('Success: DELETE /departments/' + req.params.departmentid);
            res.jsonp(200, { message: 'Department deleted' });
        } else {
            myConsole('Warning: DELETE /departments/' + req.params.departmentid + ' Department not found');
            res.jsonp(404, { error: 'Department not found' });
        }
    });
});



/* --------------------------------------------------------------------------------------------------- */



/* ********************************* */
// Route: GET /vteams
// Description: Get all vteams names and IDs
//
// Sample curl:
// curl -i -X GET http://localhost:5000/vteams
/* ********************************* */
app.get('/vteams', function(req, res) {
  VTeam.find({}, 'name', function(err, vteams) {
     res.jsonp(vteams);
  });
});

/* ********************************* */
// Route: GET /vteams/id,id
// Description: Get one or more vteams
//
// Sample curl:
// curl -i -X GET http://localhost:5000/vteams/id,id
/* ********************************* */
app.get('/vteams/:vteamid', function(req, res) {
    VTeam.find({
    '_id': { $in: req.params.vteamid.split(",")}}, function(err, vteam){
        if (err) {
            myConsole("Error: GET /vteams/" + req.params.vteamid);
            myConsole(err);
            res.jsonp(500, { error: err.name + ' - ' + err.message });
        } else if (!vteam.length) { 
            myConsole("Warning: GET /vteams/" + req.params.vteamid + " No results");
            res.jsonp(404, { error: 'No vteams found' });
        } else {
            myConsole("Successful: GET /vteams/" + req.params.vteamid);
            res.jsonp(vteam);
        }
    });    
});

/* ********************************* */
// Route: POST /vteams
// Description: Add a vteam. Validation done at schema level.
//
// Sample curl:
// curl -i -X POST -H 'Content-Type: application/json' -d'{"name": "Baseball Cards", "status": "in progress"}' http://localhost:5000/vteams?key=532b0ded565784050ab40b02
/* ********************************* */
app.post('/vteams', checkAuth, function(req, res) {
    var myVTeam = new VTeam(req.body);
    myVTeam.save(function (err) {
    if (err) {
        myConsole('Error: POST /vteams/ Unable to create vteam');
        res.jsonp(500, { error: err.name + ' - ' + err.message });
    } else {
        myConsole("Successful: POST /vteams/" + myVTeam._id);
        res.jsonp(myVTeam);
    }
  });
});

/* ********************************* */
// Route: PUT /vteams/id
// Description: Modify required vteam information
//
// Sample curl:
// curl -i -X PUT -H 'Content-Type: application/json' -d '{"name": "Baseball Cards Phase 2"}' http://localhost:5000/vteams/531f6a31cf9b3bdb1580eef9
/* ********************************* */
app.put('/vteams/:vteamid', checkAuth, function(req, res) {
    var query = { _id: req.params.vteamid };
    VTeam.update(query, req.body, function (err, numberAffected, raw) {
        if (err) {
           myConsole('Error: PUT /vteams/' + req.params.vteamid);
           res.jsonp(500, { error: err.name + ' - ' + err.message });
        } else {
            res.jsonp({'id' : req.params.vteamid});
        }
    });
});

/* ********************************* */
// Route: PUT /vteams/id/members/id
// Description: Add a user to a vteam
//
// Sample curl:
// curl -i -X PUT http://localhost:5000/vteams/532a02a910536e2128234c8b/members/5329f663c43b5a461b507c5a?key=5329ce5315a953d40d7d3cd4
/* ********************************* */
app.put('/vteams/:vteamid/members/:userid', checkAuth, function(req, res) {
    var query = { _id: req.params.vteamid };

    VTeam.update(query, { $addToSet: { members: req.params.userid } }, function (err, numberAffected, raw) {
        if (err) {
           myConsole('Error: PUT /vteams/' + req.params.vteamid + '/members');
           res.jsonp(500, { error: err.name + ' - ' + err.message });
        } else if (numberAffected) {
            myConsole('Success: PUT /vteams/' + req.params.vteamid + '/members');
            res.jsonp({'id' : req.params.userid});
        } else {
            myConsole('Warning: PUT /vteams/' + req.params.vteamid + '/members VTeam not found!');
            res.jsonp(404, { error: 'VTeam not found' });
        }
    });
});

/* ********************************* */
// Route: DELETE /vteams/id/members/id
// Description: Remove a user from a vteam
//
// Sample curl:
// curl -i -X DELETE http://localhost:5000/vteams/532a01c510536e2128234c8a/members/531f6a31cf9b3bdb1580eef9?key=5329ce5315a953d40d7d3cd4
/* ********************************* */
app.delete('/vteams/:vteamid/members/:userid', checkAuth, function(req, res) {
    var query = { _id: req.params.vteamid };

    VTeam.update(query, { $pull: { members: req.params.userid } }, function (err, numberAffected, raw) {
        if (err) {
           myConsole('Error: DELETE /vteams/' + req.params.vteamid + '/members/' + req.params.userid);
           res.jsonp(500, { error: err.name + ' - ' + err.message });
        } else if (numberAffected) {
            myConsole('Success: DELETE /vteams/' + req.params.vteamid + '/members/' + req.params.userid);
            res.jsonp({ message: req.params.userid + ' removed from vteam' });
        } else {
            myConsole('Warning: DELETE /vteams/' + req.params.vteamid + '/members/'  + req.params.userid + ' VTeam not found!');
            res.jsonp(404, { error: 'VTeam not found' });
        }
    });
});

/* ********************************* */
// Route: DELETE /vteams/id
// Description: Delete a vteam
//
// Sample curl:
// curl -i -X DELETE http://localhost:5000/vteams/532a01c510536e2128234c8a?key=5329ce5315a953d40d7d3cd4
/* ********************************* */
app.delete('/vteams/:vteamid', checkAuth, function(req, res) {
    VTeam.findByIdAndRemove(req.params.vteamid, function (err, resource) {
        if (err) { 
            myConsole('Error: DELETE /vteams/' + req.params.vteamid);
            res.jsonp(500, { error: err.name + ' - ' + err.message });
        } else if (resource) {
            myConsole('Success: DELETE /vteams/' + req.params.vteamid);
            res.jsonp({ message: 'VTeam deleted' });
        } else {
            myConsole('Warning: DELETE /vteams/' + req.params.vteamid + ' VTeam not found');
            res.jsonp(404, { error: 'VTeam not found' });
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
    
    Login.findOne({ 'username': req.body.username }, function(err, user){
        if (err) {
            myConsole("Error: POST /login");
            myConsole(err);
            res.jsonp(500, { error: err.name + ' - ' + err.message });
        } else if (!user) { 
            myConsole("Warning: POST /login User does not exist");
            res.jsonp(404, { error: 'User does not exist' });
        } else {
            bcrypt.compare(req.body.password, user.password, function(err, doesMatch){
                if (doesMatch){
                    var myKey = new Key({'level': user.level });
                    myKey.save(function (err) {
                        if (err) {
                            myConsole('Error: Unable to save key');
                            res.jsonp(500, { error: err.name + ' - ' + err.message });
                        } else {
                            myConsole('Successful: Valid key sent');
                            res.jsonp({'key' : myKey._id});
                        }
                    });
                } else {
                    myConsole("Error: POST /login Incorrect password");
                    res.jsonp(500, { error: 'Incorrect password' });
                }
             });
        }
    });    
});




/* ********************************* */
// Start the server
/* ********************************* */
port = process.env.PORT || 5000;
app.listen(port, function() {
  console.log("UX API Listening on: http://localhost:" + port + "/");
});

module.exports = app;