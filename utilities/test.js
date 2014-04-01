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
curl -i -X POST -H 'Content-Type: application/json' -d '{"username": "jpulgar", "password": "password"}' http://localhost:5000/logins

Temp key: 532c561aa3a6efcb054896e3

// Add user and skills
curl -i -X POST -H 'Content-Type: application/json' -d '{"name": "Billy Archibald", "jobTitle": "Cat"}' http://localhost:5000/users?key=532c561aa3a6efcb054896e3
curl -i -X PUT -H 'Content-Type: application/json' -d '[{"title": "HTML", "rating": "5.0"}, {"title": "CSS", "rating": "4.5"}]' http://localhost:5000/users/532c5681a3a6efcb054896e4/skills?key=532c561aa3a6efcb054896e3

// Create department
curl -i -X POST -H 'Content-Type: application/json' -d '{"name": "FED"}' http://localhost:5000/departments?key=532c561aa3a6efcb054896e3

// Add user to department
curl -i -X PUT http://localhost:5000/departments/532c5793a3a6efcb054896e7/members/532c5681a3a6efcb054896e4?key=532c561aa3a6efcb054896e3
curl -i -X PUT http://localhost:5000/departments/532b1d1db09bcfff1020a9aa/members/532c5681a3a6efcb054896e4?key=532c561aa3a6efcb054896e3



// Add user to vteam


*/



