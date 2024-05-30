const mongoose = require ('mongoose')

module.exports = mongoose.model('products', new mongoose.Schema({
    id: String,
    name: String,
    description: String,
    imageURL: String,
    creatorID: String,
    price: Number,
    gallery: Array
}));
