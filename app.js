/* 

Todo:
- Add IP white listning https://www.npmjs.org/package/express-ipfilter  https://www.npmjs.org/package/ipfilter
- Add email and Skype and FTE/Contractor/Third-Party
- Add user tags (ASAP/PDP)
- Clean up JSONP replies, instead of returning id, return the whole object
- Special functions should pass a key as URL parameter

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
    User.find({
    '_id': { $in: req.params.userid.split(",")}}, function(err, user){
        if (err) {
            myConsole("Error: GET /users/" + req.params.userid);
            myConsole(err);
            res.jsonp(500, { error: err.name + ' - ' + err.message });
        } else if (!user.length) { 
            myConsole("Warning: GET /users/" + req.params.userid + " No results");
            res.jsonp(404, { error: 'User does not exist.' });
        } else {
            myConsole("Successful: GET /users/" + req.params.userid);
            res.jsonp(user);
        }
    });    
});

/* ********************************* */
// Route: POST /users
// Description: Add a user
//
// Sample curl:
// curl -i -X POST -H 'Content-Type: application/json' -d '{"name": "Jose Pulgar", "headshot": "http://goo.gl/dofijdf", "startDate": "2014-01-01", "jobTitle": "Manager"}' http://localhost:5000/users
/* ********************************* */
app.post('/users', function(req, res) {
  var myUser = new User({name: req.body.name, headshot: req.body.headshot, startDate: req.body.startDate, jobTitle: req.body.jobTitle});
    myUser.save(function (err) {
    if (err) {
           myConsole('Error: POST /users/ Unable to create user');
           res.jsonp(500, { error: err.name + ' - ' + err.message });
    } else {
        res.jsonp({'id' : myUser._id});
    }
  });
});

/* ********************************* */
// Route: PUT /users/id
// Description: Modify required user information
//
// Sample curl:
// curl -i -X PUT -H 'Content-Type: application/json' -d '{"name": "Jose Pulgar", "headshot": "http://goo.gl/dofijdf, "startDate": "2014-01-01", "jobTitle": "Manageadfdfdsfr"}' http://localhost:5000/users/531f6a31cf9b3bdb1580eef9
/* ********************************* */
app.put('/users/:userid', function(req, res) {
    var query = { _id: req.params.userid };

    User.update(query, {name: req.body.name, headshot: req.body.headshot, startDate: req.body.startDate, jobTitle: req.body.jobTitle}, function (err, numberAffected, raw) {
        if (err) {
           myConsole('Error: PUT /users/' + req.params.userid);
           res.jsonp(500, { error: err.name + ' - ' + err.message });
        } else {
            res.jsonp({'id' : req.params.userid});
        }
    });
});

/* ********************************* */
// Route: PUT /users/id/skills
// Description: Add/Modify Skills
//
// Sample curl:
// curl -i -X PUT -H 'Content-Type: application/json' -d '[{"title": "HTML", "rating": "5.0"}, {"title": "CSS", "rating": "4.5"}]' http://localhost:5000/users/53209a24eae268ac0da6b5eb/skills
/* ********************************* */
app.put('/users/:userid/skills', function(req, res) {
    var query = { _id: req.params.userid };

    // Remove other skills
    User.update(query, {$set: { skills: [] }}, function (err) {
       if (err) { 
           myConsole('Error: Unable to delete user skills!');
           res.jsonp(500, { error: 'Unable to delete user skills' });
       } 
    });
    
    // Add all skills
    User.update(query, {$addToSet : { skills: { $each: req.body } }}, { upsert: true }, function (err, numberAffected, raw) {
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
// Route: PUT /users/id/profile
// Description: Add/Modify Profile
//
// Sample curl:
// curl -i -X PUT -H 'Content-Type: application/json' -d '[{"title": "HTML", "details": "5.0"}, {"title": "CSS", "details": "4.5"}]' http://localhost:5000/users/53209a24eae268ac0da6b5eb/profile
/* ********************************* */
app.put('/users/:userid/profile', function(req, res) {
    var query = { _id: req.params.userid };

    // Remove existing Profile
    User.update(query, {$set: { profile: [] }}, function (err) {
       if (err) { 
           myConsole('Error: Unable to delete user profile!');
           res.jsonp(500, { error: 'Unable to delete user profile' });
       } 
    });
    
    // Add profile
    User.update(query, {$addToSet : { profile: { $each: req.body } }}, { upsert: true }, function (err, numberAffected, raw) {
        if (err) {
            myConsole('Error: PUT /users/' + req.params.userid + '/profile');
            res.jsonp(500, { error: err.name + ' - ' + err.message });
        } else if (numberAffected) {
            myConsole('Success: PUT /users/' + req.params.userid + '/profile');
            res.jsonp({'id' : req.params.userid});
        } else {
            myConsole('Warning: PUT /users/' + req.params.userid + '/profile no rows affected!');
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
app.delete('/users/:userid', function(req, res) {
    User.findByIdAndRemove(req.params.userid, function (err, resource) {
        if (err) { 
            myConsole('Error: DELETE /users/' + req.params.userid);
            res.jsonp(500, { error: err.name + ' - ' + err.message });
        } else if (resource) {
            myConsole('Success: DELETE /users/' + req.params.userid);
            res.jsonp({ message: 'User deleted' });
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
  Department.find({}, 'name', function(err, users) {
     res.jsonp(users);
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
// curl -i -X POST -H 'Content-Type: application/json' -d '{"name": "Project Managers"}' http://localhost:5000/departments
/* ********************************* */
app.post('/departments', function(req, res) {
  var myDepartment = new Department({name: req.body.name});
    myDepartment.save(function (err) {
    if (err) {
           myConsole('Error: POST /departments/ Unable to create department');
           res.jsonp(500, { error: err.name + ' - ' + err.message });
    } else {
        res.jsonp({'id' : myDepartment._id});
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
app.put('/departments/:departmentid', function(req, res) {
    var query = { _id: req.params.departmentid };

    Department.update(query, {name: req.body.name}, function (err, numberAffected, raw) {
        if (err) {
           myConsole('Error: PUT /departments/' + req.params.departmentid);
           res.jsonp(500, { error: err.name + ' - ' + err.message });
        } else {
            res.jsonp({'id' : req.params.departmentid});
        }
    });
});

/* ********************************* */
// Route: PUT /departments/id/members
// Description: Add a user to a department
//
// Sample curl:
// curl -i -X PUT -H 'Content-Type: application/json' -d '{"user": "531f6a31cf9b3bdb1580eef9"}' http://localhost:5000/departments/531a2875e454ce0ad42d6465/members
/* ********************************* */
app.put('/departments/:departmentid/members', function(req, res) {
    var query = { _id: req.params.departmentid };

    Department.update(query, { $addToSet: { members: req.body.user } }, function (err, numberAffected, raw) {
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
// curl -i -X DELETE http://localhost:5000/departments/531a2875e454ce0ad42d6465/members/531f6a31cf9b3bdb1580eef9
/* ********************************* */
app.delete('/departments/:departmentid/members/:userid', function(req, res) {
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
app.delete('/departments/:departmentid', function(req, res) {
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
  VTeam.find({}, 'name', function(err, users) {
     res.jsonp(users);
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
// Description: Add a vteam
//
// Sample curl:
// curl -i -X POST -H 'Content-Type: application/json' -d '{"name": "Baseball Cards"}' http://localhost:5000/vteams
/* ********************************* */
app.post('/vteams', function(req, res) {
  var myVTeam = new VTeam({name: req.body.name});
    myVTeam.save(function (err) {
    if (err) {
           myConsole('Error: POST /vteams/ Unable to create vteam');
           res.jsonp(500, { error: err.name + ' - ' + err.message });
    } else {
        res.jsonp({'id' : myVTeam._id});
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
app.put('/vteams/:vteamid', function(req, res) {
    var query = { _id: req.params.vteamid };

    VTeam.update(query, {name: req.body.name}, function (err, numberAffected, raw) {
        if (err) {
           myConsole('Error: PUT /vteams/' + req.params.vteamid);
           res.jsonp(500, { error: err.name + ' - ' + err.message });
        } else {
            res.jsonp({'id' : req.params.vteamid});
        }
    });
});

/* ********************************* */
// Route: PUT /vteams/id/members
// Description: Add a user to a vteam
//
// Sample curl:
// curl -i -X PUT -H 'Content-Type: application/json' -d '{"user": "531f6a31cf9b3bdb1580eef9"}' http://localhost:5000/vteams/531a2875e454ce0ad42d6465/members
/* ********************************* */
app.put('/vteams/:vteamid/members', function(req, res) {
    var query = { _id: req.params.vteamid };

    VTeam.update(query, { $addToSet: { members: req.body.user } }, function (err, numberAffected, raw) {
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
// curl -i -X DELETE http://localhost:5000/vteams/531a2875e454ce0ad42d6465/members/531f6a31cf9b3bdb1580eef9
/* ********************************* */
app.delete('/vteams/:vteamid/members/:userid', function(req, res) {
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
// curl -i -X DELETE http://localhost:5000/vteams/5321ed85b1d521421389276e
/* ********************************* */
app.delete('/vteams/:vteamid', function(req, res) {
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
// Route: POST /login
// Description: Get key
//
// Sample curl:
// curl -i -X POST -H 'Content-Type: application/json' -d '{"username": "jpulgar", "password": "secret"}' http://localhost:5000/login
/* ********************************* */
app.post('/logins', function(req, res) {
    
    // Salt and hash the sent password
    // then do a find
    // only store hashed passwords on server
    
    
    // Generate a salt + hash and store it in mongo
    // var hash = bcrypt.hashSync("my password", 10);
    // read the hash from the server and compare
    // bcrypt.compareSync("my password", hash); // true
    // bcrypt.compareSync("not my password", hash); // false
    
    
    
    // find only the username
    Login.findOne({ 'username': req.body.username, 'password': req.body.password }, function(err, user){
        if (err) {
            myConsole("Error: POST /login");
            myConsole(err);
            res.jsonp(500, { error: err.name + ' - ' + err.message });
        } else if (!user) { 
            myConsole("Warning: POST /login User does not exist");
            res.jsonp(404, { error: 'User does not exist' });
        } else {
            
            // now read the hash password and do a test, if true, then do the following
            
            var myKey = new Key({'level': user.level });
            myKey.save(function (err) {
                if (err) {
                       myConsole('Error: Unable to save key');
                       res.jsonp(500, { error: err.name + ' - ' + err.message });
                } else {
                    res.jsonp({'key' : myKey._id});
                }
            });
            
            // if false, return incorrect password
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