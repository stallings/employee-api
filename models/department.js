var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = Schema.ObjectId;

var departmentSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    members: [ObjectId]
});

module.exports = mongoose.model('Department', departmentSchema);
