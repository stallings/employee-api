/* jshint node: true */
if (process.argv.length !== 4) {
    console.log('Usage: node renameUser.js ["Old Full Name"] ["New Full Name"]');
    console.log('Usage: node renameUser.js "Jen Smith" "Jennifer Smith"');
    process.exit(0);
}

// Requires
var mongoose = require('mongoose'),
    database = require('../config/database'),
    User = require('../models/user');

var oldName = process.argv[2],
    newName = process.argv[3];


// Connect to MongoDB
mongoose.connect(database.url, function (err) {
    "use strict";
    if (err) {
        console.log('Error: Unable to connect to MongoDB!');
    } else {
        User.findOne({
            '_id': oldName
        }, function (err, user) {

            // Add new name user
            var newUser = user;
            newUser._id = newName;
            User.create(newUser, function (err) {
                if (err) {
                    console.log(err);
                } else {
                    console.log(newName + " inserted");

                    // Remove old user
                    User.remove({
                        _id: oldName
                    }, function (err) {
                        if (err) {
                            console.log(err);
                        } else {
                            console.log(oldName + " removed");

                            // Change manager names
                            User.update({
                                manager: oldName
                            }, {
                                $set: {
                                    manager: newName
                                }
                            }, {
                                multi: true
                            }, function (err, numberAffected) {
                                if (err) {
                                    console.log(err);
                                } else {
                                    console.log("Manager fields updated (" + numberAffected + ")");

                                    // Change direct report names
                                    User.update({
                                        directs: oldName
                                    }, {
                                        $set: {
                                            'directs.$': newName
                                        }
                                    }, {
                                        multi: true
                                    }, function (err, numberAffected) {
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
        });
    }
});
