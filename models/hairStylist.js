const mongoose = require('mongoose');
mongoose.connect('mongodb+srv://thucnguyen1907:thucnguyen1907@cluster0.qwzlcau.mongodb.net/ServerHairCut');

const hariStylistSchema = new mongoose.Schema({
    nameStylist: {
        type: 'String',
        require: true
    },
    imageStylist: {
        type: 'String',
        require: true
    },
    status: {
        type: Number,
        default: 0
    },
    description: {
        type: 'String',
        require: true
    },
    createAt: {
        type: Date,
        default: Date.now()
    }
});
const HairStylist = mongoose.model('HairStylist', hariStylistSchema);

module.exports = HairStylist;