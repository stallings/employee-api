var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = Schema.ObjectId;

var skillSchema = new Schema({ 
    title: { type: String, required: true },
    rating: { type: Number, max: 5, required: true }
});

var profileSchema = new Schema({
    title: { type: String, required: true },
    details: { type: String, required: true }
});

var userSchema = new Schema({
  name: { type: String, required: true },
  headshot: { type: String, required: true },
  startDate: { type: Date, required: true },
  jobTitle: { type: String, required: true },
  skills: [skillSchema],
  profile: [profileSchema]
});

module.exports = mongoose.model('User', userSchema);
