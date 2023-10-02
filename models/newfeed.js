const mongoose = require('mongoose');
mongoose.connect('mongodb+srv://thucnguyen1907:thucnguyen1907@cluster0.qwzlcau.mongodb.net/ServerHairCut');
const newfeed = new mongoose.Schema({
    title: {
        type: 'String',
        require: true
    },
    contentTitle: {
        type: 'String',
        require: true
    },
    description: {
        type: 'String',
        require: true
    },
    image: Array,
    createAt: {
        type: Date,
        default: Date.now()
    }
});
const Newfeed = mongoose.model('Newfeed', newfeed);
module.exports = Newfeed;