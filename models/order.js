const mongoose = require('mongoose');
const {Schema} = require("mongoose");
mongoose.connect('mongodb+srv://thucnguyen1907:thucnguyen1907@cluster0.qwzlcau.mongodb.net/ServerHairCut');

const orderSchema = new mongoose.Schema({
    customerId: {
        type: Schema.Types.ObjectId,
        ref: 'Customer'
    },
    serviceIds: {
        type: Array,
        require: true
    },
    stylistId: {
        type: String,
        require: true
    },
    status: {
        type: Number,
        default: 0
    },
    time: {
        type: Date,
        default: Date.now()
    },
    totalTime: {
        type: Number,
        default: 0
    },
    note: {
        type: String,
        default: ''
    },
    sumPrice: {
        type: Number,
        default: 0
    },
    createAt:{
        type: Date,
        default: Date.now()
    }
});
const Order = mongoose.model('Order', orderSchema);

module.exports = Order;