if (process.argv.length != 5) {
    console.log('Usage: node addUser.js [username] [password] [level]');
    console.log('Usage: node addUser.js jpulgar secretpassword 3');
    process.exit(0);
}

// Requires
var mongoose = require('mongoose'),
    bcrypt = require('bcrypt'),
    database = require('../config/database'),
    Login = require('../models/login');

// Connect to MongoDB
mongoose.connect(database.url, function(err) {
    "use strict";
    if (err) {
        console.log('Error: Unable to connect to MongoDB!');
    } else {
        // Create the user after salting + hashing the password
        bcrypt.hash(process.argv[3], 10, function(err, bcryptedPassword) {
            if (err) {
                console.log('Error: Unable to bcrypt password');
            } else {
                var query = {
                    _id: process.argv[2].toLowerCase()
                };
                Login.update(query, {
                    $set: {
                        password: bcryptedPassword,
                        level: process.argv[4]
                    }
                }, {
                    upsert: true
                }, function(err, numberAffected, raw) {
                    if (err) {
                        console.log('Error: Unable to add user');
                        console.log(err.message);
                    } else {
                        console.log('User added: ' + process.argv[2].toLowerCase());
                        process.exit(0);
                    }
                });
            }
        });
    }
});
