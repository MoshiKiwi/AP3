const mongoose = require ('mongoose')

module.exports = mongoose.model('commentaires', new mongoose.Schema({
    id: String,
    productID: String,
    creatorID: String,
    comment: String,
    score: Number
}));
