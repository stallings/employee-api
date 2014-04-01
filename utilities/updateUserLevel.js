if (process.argv.length != 4) {
    console.log('Usage: node updateUserLevel.js [username] [level]');
    console.log('Usage: node updateUserLevel.js jpulgar 3');
    process.exit(0);
}

// Requires
var mongoose = require('mongoose'),
    database = require('../config/database'),
    Login = require('../models/login');

// Connect to MongoDB
mongoose.connect(database.url, function (err) {
    "use strict";
    if (err) {
        console.log('Error: Unable to connect to MongoDB!');
    } else {
        var query = {
            username: process.argv[2]
        };
        Login.update(query, {
            $set: {
                username: process.argv[2],
                level: process.argv[3]
            }
        }, function (err, numberAffected, raw) {
            if (err) {
                console.log('Error: Unable to update user level');
            } else {
                console.log('User ' + process.argv[2] + ' level modified.');
                process.exit(0);
            }
        });
    }
});