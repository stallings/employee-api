if (process.argv.length != 3) {
    console.log('Usage: node deleteUser.js [username]');
    console.log('Usage: node deleteUser.js jpulgar');
    process.exit(0);  
}

// Requires
var mongoose = require('mongoose'),
    database = require('../config/database'),
    Login = require('../models/login');

// Connect to MongoDB
mongoose.connect(database.url, function(err) { 
    if (err) myConsole('Error: Unable to connect to MongoDB!');
});


var query = { username: process.argv[2] };
Login.findOneAndRemove(query, function (err, user) {
    if (err) { 
        console.log('Error: Unable to delete user');
    } else {
        console.log('User removed');
        process.exit(0);   
    }
});    


