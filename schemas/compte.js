const mongoose = require ('mongoose')

module.exports = mongoose.model('comptes', new mongoose.Schema({
    id: String,
    name: String,
    email: String,
    password: String
}));
