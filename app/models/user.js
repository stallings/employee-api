var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var skillSchema = new Schema({
    _id: {
        type: String,
        // required: true
    },
    rating: {
        type: Number,
        min: 1,
        max: 5,
        // required: true
    }
});

var userSchema = new Schema({
///////////////////////////////    
//////// Required /////////////
///////////////////////////////
    _id: {
        type: String,
        required: true
    },
    username: {
        type: String,
        required: true
    },
    firstname:{
        type: String,
        // required true
    },
    lastname:{
        type: String,
        // required: true
    },
    discipline:{
        type: String,
        // required: true
    },
    profileImg:{
        type: String
        // required: true
    },
    title: {
        type: String,
        // required: true
    },
    department: {
        type: String,
        enum: ['PjM', 'Copy', 'FED', 'UXA', 'Visual Design', 'User Research'],
        // required: true
    },
    employeeType: {
        type: String,
        enum: ['FTE', 'Contractor'],
        // required: true
    },
    manager: {
        type: String,
        // required: true
    },
    directs: [String],
    level: {
        type: Number,
        // required: true
    },

///////////////////////////////    
//////// Optional /////////////
///////////////////////////////

    // Contact info
    skypeid:{
        type: String
    },
    desknum:{
        type: String
    },
    phonenum:{
        type: String
    },
    email:{
        type: String
    },
    location:{
        type: String
    },

    // System info
    machinenum:{
        type: String
    },
    machinetype:{
        type: String
    },
    operatingsystem:{
        type: String
    },
    last5:{
        type: String
    },
    // TODO: Additional software information
    addnotes:{
        type: String
    },





    password: {
        type: String
    },
    headshot: {
        type: String
    },
    startDate: {
        type: Date
    },
    skype: {
        type: String
    },
    strenghts: [String],
    skills: [skillSchema],
    mentor:{
        type: String
    },
    mentee:{
        type: String
    },
    buddy:{
        type: String
    }


});

module.exports = mongoose.model('User', userSchema);
