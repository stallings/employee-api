// Requires
var mongoose = require('mongoose');

// Add Models
var Login = require('./models/login');

// Connect to MongoDB
mongoose.connect( 'mongodb://localhost/baseball', function(err) { 
    if (err) myConsole('Error: Unable to connect to MongoDB!');
});

Login
    .find({})
    .select('username level')
    .sort('username')
    .exec(function (err, user) {
        if (err) { 
            console.log('Error: Unable to list users');
        } else {
            for (var i = 0; i < user.length; i++) {
                console.log('%s %s', user[i].username, user[i].level);
            }
            process.exit(0);   
        }
    });


