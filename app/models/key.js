// Levels:
// 1 - Individual Contributor
// 2 - Manager
// 3 - Director
// 4 - VP

// Key expires every X number of seconds
var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var keySchema = new Schema({
    level: {
        type: Number,
        required: true
    },
    self: {
        type: String,
        required: true
    },
    edit: {
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
