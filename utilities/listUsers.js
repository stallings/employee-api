/* jshint node: true */

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
        User
            .find({})
            .select('_id level')
            .sort('_id')
            .exec(function(err, user) {
                if (err) {
                    console.log('Error: Unable to list users');
                } else {
                    for (var i = 0; i < user.length; i++) {
                        console.log('%s %s', user[i]._id, user[i].level);
                    }
                    process.exit(0);
                }
            });
    }
});
