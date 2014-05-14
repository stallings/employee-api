/* jshint node: true */
if (process.argv.length !== 4) {
    console.log('Usage: node updateUserLevel.js ["Full Name"] [level]');
    console.log('Usage: node updateUserLevel.js "Jose Pulgar" 5');
    process.exit(0);
}

// Requires
var mongoose = require('mongoose'),
    database = require('../config/database'),
    User = require('./user');

// Connect to MongoDB
mongoose.connect(database.url, function (err) {
    "use strict";
    if (err) {
        console.log('Error: Unable to connect to MongoDB!');
    } else {
        var query = {
            _id: process.argv[2]
        };
        User.update(query, {
            $set: {
                level: process.argv[3]
            }
        }, function (err) {
            if (err) {
                console.log('Error: Unable to update user level');
            } else {
                console.log(process.argv[2] + ' level modified to: ' + process.argv[3]);
                process.exit(0);
            }
        });
    }
});
