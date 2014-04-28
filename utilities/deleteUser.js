if (process.argv.length != 3) {
    console.log('Usage: node deleteUser.js ["Full Name"]');
    console.log('Usage: node deleteUser.js "Jose Pulgar"');
    process.exit(0);
}

// Requires
var mongoose = require('mongoose'),
    database = require('../config/database'),
    User = require('../models/user');

var userName = process.argv[2],
    userManager = "";

// Connect to MongoDB
mongoose.connect(database.url, function(err) {
    "use strict";
    if (err) {
        console.log('Error: Unable to connect to MongoDB!');
    } else {
        User.findOneAndRemove({ _id: userName }, function(err, user) {
            if (err) {
                console.log('Error: Unable to delete user');
            } else {
                userManager = user.manager;
                console.log('User removed: ' + process.argv[2]);
                // Change manager names
                User.update({ manager: userName },
                    { $set: { manager: userManager } },
                    { multi: true }, function(err, numberAffected) {
                        if (err) {
                            console.log(err);
                        } else {
                            console.log("Manager fields updated (" + numberAffected + ")");

                            // Change direct report names
                            User.update({ directs: userName },
                                { $pull: { directs : userName } },
                                { multi: true }, function(err, numberAffected) {
                                    if (err) {
                                        console.log(err);
                                    } else {
                                        console.log("Direct report fields updated (" + numberAffected + ")");
                                        process.exit(0);
                                    }
                                });
                        }
                    });
            }
        });
    }
});
