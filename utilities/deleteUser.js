if (process.argv.length != 3) {
    console.log('Usage: node deleteUser.js ["Full Name"]');
    console.log('Usage: node deleteUser.js "Jose Pulgar"');
    process.exit(0);
}

// Requires
var mongoose = require('mongoose'),
    database = require('../config/database'),
    User = require('../models/user');

// Connect to MongoDB
mongoose.connect(database.url, function(err) {
    "use strict";
    if (err) {
        console.log('Error: Unable to connect to MongoDB!');
    } else {
        var query = {
            _id: process.argv[2]
        };
        User.findOneAndRemove(query, function(err, user) {
            if (err) {
                console.log('Error: Unable to delete user');
            } else {
                console.log('User removed: ' + process.argv[2]);
                process.exit(0);
            }
        });
    }
});
