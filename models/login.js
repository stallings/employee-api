var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var loginSchema = new Schema({
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
