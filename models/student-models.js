const mongoose = require('mongoose');
const Schema = mongoose.Schema; //equals connection in mongodb
const ObjectId = Schema.ObjectId;
const Student = new Schema({
    id: {type: ObjectId},
    studID: {type: String},
    studName: {type: String},
    avgScore: {type: Number},
    major: {type: String},
    age: {type: Number}
});
module.exports = mongoose.models.Student || mongoose.model('Student', Student);