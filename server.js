/* jshint node: true */

// Requires
var express = require('express'),
    bodyParser = require('body-parser'),
    morgan = require('morgan'),
    mongoose = require('mongoose'),
    cors = require('cors'),
    database = require('./app/config/database');


// Create Express App and use JSON/urlencoded parsing middleware
var app = express();

app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json())
app.use(cors({
    origin: '*'
}));

var env = process.env.NODE_ENV || 'development';
if (env === 'development') {
    app.use(morgan('dev'));
}

// Set routes
app.use(express.static(__dirname + '/public'));
require('./app/routes/index')(app);

// Connect to Mongo Database and start server
mongoose.connect(database.url, function (err) {
    "use strict";
    if (err) {
        console.log('Error: Unable to connect to MongoDB!');
    } else {
        var server = app.listen(5000, function () {
            console.log('Employee API Listening on: http://localhost:%d', server.address().port);
        });
    }
});



