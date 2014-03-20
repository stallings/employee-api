var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = Schema.ObjectId;

var skillSchema = new Schema({ 
    title: { type: String, required: true },
    rating: { type: Number, max: 5, required: true }
});

var userSchema = new Schema({
  name: { type: String, required: true },
  headshot: { type: String },
  startDate: { type: Date },
  jobTitle: { type: String, required: true },
  skills: [skillSchema]
});

module.exports = mongoose.model('User', userSchema);
