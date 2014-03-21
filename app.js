/* 
Todo:
- Add Tags model (ASAP/PDP), tags can have members so you can easily see the people with those skills

Future:
- Org chart: who is manager, who are direct reports
*/

// Requires
var express  = require('express'),
    mongoose = require('mongoose'),
    bcrypt   = require('bcrypt');

// Express app
var app = express();
app.use(express.urlencoded());
app.use(express.json());

// Set routes
require('./routes')(app);

// Connect to MongoDB
var database = require('./config/database');
mongoose.connect(database.url, function(err) { 
    if (err) myConsole('Error: Unable to connect to MongoDB!');
});

// Start server
port = process.env.PORT || 5000;
app.listen(port, function() {
  console.log("UX API Listening on: http://localhost:" + port + "/");
});

module.exports = app;