var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var loginSchema = new Schema({
    // If we make the _id match the user _id, we can get the direct results
    _id: {
        type: String,
        lowercase: true,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    level: {
        type: Number,
        required: true
    }
});

module.exports = mongoose.model('Login', loginSchema);
