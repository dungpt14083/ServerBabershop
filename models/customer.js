const mongoose = require('mongoose');
mongoose.connect('mongodb+srv://thucnguyen1907:thucnguyen1907@cluster0.qwzlcau.mongodb.net/ServerHairCut');
const jwt = require('jsonwebtoken');
require('dotenv').config();
const hiddenString = process.env.TOKEN_SEC_KEY;
const bcrypt = require('bcrypt');
const customer = new mongoose.Schema({

    nameUser: {
        type: 'String',
        // default:" Nguyen Van A"
    },
    password: {
        type: 'String',
        require: true
    },
    accessLv:{
        type:Number,
        default:0,
    },
    statusC:{
        type:Number,
        default:0
    },
    birthOfYear: {
        type: Date,
        default:'1990-01-01'
    },
    phone: {
        type: Number,
        require: true
    },
    address: {
        type: 'String',
        require: false,
        default:" Ha Noi"
    },
    image: {
        type: 'String',
        require: false,
        default:'uploads/profiles.png'

    },
    created: {
        type: Date,
        default: Date.now()
    }
});
/**
 * Hàm tạo token để đăng nhập với API
 * @returns {Promise<*>}
 */
customer.methods.generateAuthToken = async function () {
    const customer = this;
    const token = jwt.sign({_id: customer._id}, hiddenString);
    customer.token = token; //customer.concat({token});
    await customer.save();
    return token;
}
/**
 * Hàm tìm kiếm user theo tài khoản
 * @param username
 * @param passwd
 * @returns {Promise<*>}
 */
customer.statics.findByCredentials = async (phone, password) => {
    const customer = await Customer.findOne({phone});
    if (!customer) {
        throw new Error({error: 'Invalid login credentials'});
    }
    const isPasswordMatch = await bcrypt.compare(password, customer.password);
    if (!isPasswordMatch) {
        throw new Error({error: 'Invalid login credentials'});
    }
    return customer;
}
const Customer = mongoose.model('Customer', customer);
module.exports = Customer;
