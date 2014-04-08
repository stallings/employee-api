// Levels: 1 - Manager, 2 - Director, 3 - VP

// VP + Lana: full access
// Director: full access to managers and their directs
// Manager: full access to direct reports only
// Individual Contributor: default access, no valid login

// Key expires every X number of seconds
var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var keySchema = new Schema({
    level: {
        type: Number,
        required: true
    },
    directReports: {
        type: [String]
    },
    createdAt: {
        type: Date,
        expires: 60 * 60 * 8,
        default: Date.now,
        unique: true
    }
});

module.exports = mongoose.model('Key', keySchema);
