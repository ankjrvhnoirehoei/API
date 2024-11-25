const mongoose = require('mongoose');
const Schema = mongoose.Schema; //equals connection in mongodb
const ObjectId = Schema.ObjectId;
const Product = new Schema({
    id: {type: ObjectId},
    proID: { type: String },
    proName: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    price: {
        type: Number,
        required: true,
        trim: true
    },
    quantity: {
        type: Number,
        required: true,
        trim: true
    }
});

module.exports = mongoose.models.Product || mongoose.model('Product', Product);