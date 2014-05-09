/* jshint node: true */
if (process.argv.length !== 6) {
    console.log('Usage: node addUser.js ["Full Name"] [password] [level]');
    console.log('Usage: node addUser.js "Jose Pulgar" secretpassword 3');
    process.exit(0);
}

// Requires
var mongoose = require('mongoose'),
    bcrypt = require('bcrypt'),
    database = require('../config/database'),
    User = require('../models/user');


// Connect to MongoDB
mongoose.connect(database.url, function (err) {
    "use strict";
    if (err) {
        console.log('Error: Unable to connect to MongoDB!');
    } else {
        // Create the user after salting + hashing the password
        bcrypt.hash(process.argv[4], 10, function (err, bcryptedPassword) {
            if (err) {
                console.log('Error: Unable to bcrypt password');
            } else {
                var query = {
                    _id: process.argv[2]
                };
                User.update(query, {
                    $set: {
                        password: bcryptedPassword,
                        level: process.argv[5]
                    }
                }, {
                    upsert: true
                }, function (err) {
                    if (err) {
                        console.log('Error: Unable to add user');
                        console.log(err.message);
                    } else {
                        console.log('User added: ' + process.argv[2]);
                        process.exit(0);
                    }
                });
            }
        });
    }
});
