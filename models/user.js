var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var skillSchema = new Schema({
    _id: {
        type: String,
        required: true
    },
    rating: {
        type: Number,
        max: 5,
        required: true
    }
});

var userSchema = new Schema({
    _id: {
        type: String,
        required: true
    },
    headshot: {
        type: String
    },
    startDate: {
        type: Date
    },
    jobTitle: {
        type: String,
        required: true
    },
    email: {
        type: String
    },
    employeeType: {
        type: String,
        enum: ['FTE', 'Contractor']
    },
    department: {
        type: String,
        enum: ['PjM', 'Copy', 'FED', 'UXA', 'Visual Design', 'User Research']
    },
    skype: {
        type: String
    },
    skills: [skillSchema],
    manager: String,
    directs: [String]
});

module.exports = mongoose.model('User', userSchema);
