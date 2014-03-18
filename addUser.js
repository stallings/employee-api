var mongoose = require('mongoose');
var bcrypt = require('bcrypt');

// username: process.argv[2]
// password: process.argv[3]

// Step 1 save to database... upsert?
bcrypt.hash(process.argv[3], 10, function( err, bcryptedPassword) {
   console.log("Save to db: " + bcryptedPassword);
});


// Step 2, read value from database and see if it's a match
var hash = "$2a$10$Rw8i/CBWt1i2pv7Tcv0TiuWC0B83wEEu2ziOeH51kDo5S9L7QPLVG";
bcrypt.compare(process.argv[3], hash, function(err, doesMatch){
  if (doesMatch){
     console.log('let user in');
  }else{
     console.log('go away');
  }
 });


    // Generate a salt + hash and store it in mongo
    // var hash = bcrypt.hashSync("my password", 10);
    
    // read the hash from the server and compare
    // bcrypt.compareSync("my password", hash); // true
    // bcrypt.compareSync("not my password", hash); // false
