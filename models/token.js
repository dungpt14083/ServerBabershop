const mongoose = require('mongoose');
mongoose.connect('mongodb+srv://thucnguyen1907:thucnguyen1907@cluster0.qwzlcau.mongodb.net/ServerHairCut');

const tokenSchema = new mongoose.Schema({
    userId: {
        type: String,
        require: true
    },
    token: {
        type: String,
        require: true
    },
    uniqueId: {
        type: String,
        require: true
    },
    lastLogin: {
        type: String,
        default: Date.now()
    }
});
const Token = mongoose.model('Token', tokenSchema);

module.exports = Token;