// Requires
var express = require('express'),
    mongoose = require('mongoose'),
    bcrypt = require('bcrypt'),
    cors = require('cors'),
    database = require('./config/database');

// Create Express App and use JSON/urlencoded parsing middleware
var app = express();

// Set up CORS (Cross-Origin Resource Sharing)
var corsOptions = {
    origin: '*'
};


app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded());

// Set routes
require('./routes')(app);

// Connect to Mongo Database and start server
mongoose.connect(database.url, function(err) {
    "use strict";
    if (err) {
        console.log('Error: Unable to connect to MongoDB!');
    } else {
        var server = app.listen(5000, function() {
            console.log('Employee API Listening on: http://localhost:%d', server.address().port);
        });
    }
});
