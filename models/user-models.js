const mongoose = require('mongoose');
const Schema = mongoose.Schema; //equals connection in mongodb
const ObjectId = Schema.ObjectId;
const User = new Schema({   //User can be named as anything
    id: { type: ObjectId }, //primary key
    userName: {
        type: String, //type
        required: true, //empty or not
        unique: true, //no dups
        trim: true, //remove whitespaces on 2 ends
        minlength: 3, 
        maxlength: 50,
        default: 'No name' //default value
    },
    password: {
        type: String,
        minlength: 6,
        required: true
    },
    age: {
        type: Number,
        required: true
    }
});

module.exports = mongoose.models.User || mongoose.model('User', User);