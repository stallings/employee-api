var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    ObjectId = Schema.ObjectId;

var projectSchema = new Schema({
    _id: {
        type: String,
        required: true
    },
    status: {
        type: String,
        enum: ['in progress', 'complete', 'on hold'],
        lowercase: true,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    members: [String]
});

module.exports = mongoose.model('Project', projectSchema);
