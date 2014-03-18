// Levels: 1 - Manager, 2 - Director, 3 - VP
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = Schema.ObjectId;

var keySchema = new Schema({
  level: { type: Number, required: true },
  createdAt: { type: Date, expires: 5, default: Date.now, unique: true }
});

module.exports = mongoose.model('Key', keySchema);
