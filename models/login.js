var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = Schema.ObjectId;

var loginSchema = new Schema({
  username: { type: String, required: true },
  password: { type: String, required: true },
  level: { type: Number, required: true }
});

module.exports = mongoose.model('Login', loginSchema);