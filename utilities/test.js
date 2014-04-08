/*

// Requires
var mongoose = require('mongoose'),
    database = require('../config/database'),
    Department = require('../models/department');

// Connect to MongoDB
mongoose.connect(database.url, function(err) {
    if (err) myConsole('Error: Unable to connect to MongoDB!');
});

Department
    .find({members: { $in : [process.argv[2]] }})
    .select('name')
    .sort('name')
    .exec(function (err, departments) {
        if (err) {
            console.log(err);
        } else {
            console.log(departments);
            process.exit(0);
        }
    });

*/




/*

// Get key
curl -i -X POST -H 'Content-Type: application/json' -d '{"_id": "jpulgar", "password": "password"}' http://localhost:5000/logins

Temp key: 53442478daec93cb0a30dd1a

// Add user and skills
curl -i -X POST -H 'Content-Type: application/json' -d '{"_id": "Billy Archibald", "jobTitle": "Cat"}' http://localhost:5000/users?key=534314d5c58d0b0609367fc9
curl -i -X PUT -H 'Content-Type: application/json' -d '[{"title": "HTML", "rating": "5.0"}, {"title": "CSS", "rating": "4.5"}]' http://localhost:5000/users/Billy%20Archibald/skills?key=534314d5c58d0b0609367fc9

// Create a project
curl -i -X POST -H 'Content-Type: application/json' -d'{"_id": "Baseball Cards", "status": in progress", "description": "An awesome project"}' http://localhost:5000/projects?key=53442478daec93cb0a30dd1a


// Add user to vteam


*/
