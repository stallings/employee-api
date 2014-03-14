var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = Schema.ObjectId;

var vteamSchema = new Schema({
  name: { type: String, required: true},
  members: [ObjectId]
});

module.exports = mongoose.model('VTeam', vteamSchema);
