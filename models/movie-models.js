const mongoose = require('mongoose');
const Schema = mongoose.Schema; //equals connection in mongodb
const ObjectId = Schema.ObjectId;
const Movie = new Schema({
    id: {type: ObjectId},
    movieID: {type: String},
    title: {type: String},
    views: {type: Number},
    totalComment: {type: Number},
    totalRating: {type: Number},
    description: {type: String},
    releaseDate: {type: String},
    userID: {type: String},
    publisher: {type: String},
    price: {type: Number},
    genre: {type: String}
});

module.exports = mongoose.models.Movie || mongoose.model('Movie', Movie);