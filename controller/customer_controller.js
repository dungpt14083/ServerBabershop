var Customer = require('../models/customer');
var Token = require('../models/token');
const bcrypt = require('bcrypt');
const jwt = require("jsonwebtoken");
var _ = require('underscore');
const mongoose = require("mongoose");
const axios = require("axios");
const url = require("url");
//search
const apiKey = "AFB477216FDED9D7A532C1F2D07551";
const secretKey = "38E247ADE507B56C49C00556D57470";
const noti = require("../controller/notification_controller");
exports.postSearch = async (req, res, next) => {
    const name = req.body.searchCustomer;
    if (name.length != 0) {
        const listCustomer = await Customer.find({nameUser: {$regex: ".*" + name + ".*", $options: "i"}});
        res.render('./customer/list_customer', {listCustomer: listCustomer})
    } else {
        const listCustomer = await Customer.find();
        res.render('./customer/list_customer', {listCustomer: listCustomer})
    }
}

//api get all
exports.getAll = async (req, res, next) => {
    let obj = await Customer.find();
    res.json(obj);
}

exports.getList = async (req, res, next) => {
    let listCustomer = await Customer.find();
    res.render('./customer/list_customer', {listCustomer: listCustomer});
}


exports.postRegisterCustomer = async (req, res, next) => {
    try {
        let body = req.body;
        let requires = [
            'password'
        ];
        let errors = [];
        _.each(requires, function (param) {
            if (!_.has(body, param))
                errors.push(param);
        })
        if (errors.length > 0) {
            res.status(400).send({code: 0, message: 'Missing field: ' + errors.toString()})
        } else {
            const salt = await bcrypt.genSalt(10);
            const customer = new Customer(body);
            customer.password = await bcrypt.hash(req.body.password, salt);
            await customer.save();

            const topicId = req.body.topicId;
            if (topicId == null) {
                console.log("Request faild !!");
            } else {
                const body = req.body.body;
                const title = req.body.title
                await noti.pushNotification(topicId, body, title);
            }
            /*
            let newToken = new Token();
            newToken.userId = customer._id;
            newToken.token = jwt.sign({_id: customer._id}, process.env.TOKEN_SEC_KEY);
            newToken.uniqueId = body['uniqueId'];
            await newToken.save();
            customer['token'] = newToken.token;
            */
            res.status(201).send(customer);
        }
    } catch (error) {
        console.log(error);
        res.status(400).send(error);
    }
}
exports.setStatus =async (req, res, next) => {
    const params = req.params;
    let customer = {
        statusC : null
    }
    customer.statusC = 1;
    Customer.findByIdAndUpdate(params['id'],customer,function (err){
        if (err){
            console.log(err);
        }else {
            console.log("status = 1");
            res.redirect('back');
        }
    })
}
exports.postUpdateCustomer = async (req, res, next) => {
    try {
        let body = req.body;
        let requires = [
            'token'
        ];
        let errors = [];
        _.each(requires, function (param) {
            if (!_.has(body, param))
                errors.push(param);
        });
        if (errors.length > 0) {
            res.json({code: 0, message: 'Missing field: ' + errors.toString()});
        } else {
            const tokenData = jwt.verify(body['token'], process.env.TOKEN_SEC_KEY);
            if (!_.has(tokenData, '_id')) {
                res.json({code: 0, message: 'Token invalid'});
            } else {
                let img;
                if (req.file) {
                    img = req.file.path.replace('public\\', '');
                }
                const customer = {
                    nameUser: req.body.nameUser,
                    birthOfYear: req.body.birthOfYear,
                    address: req.body.address,
                    image: img,
                }
                // let customerId = mongoose.Types.ObjectId(tokenData['_id']);
                let customerId = tokenData['_id'];
                Customer.findByIdAndUpdate(customerId, customer, function (err) {
                    if (err) {
                        res.json(err)
                    } else {
                        res.json({customer, msg: "Sửa thành công"});
                    }
                })
            }
        }

    } catch (error) {
        res.json(error);
    }
}

// function login
exports.postLoginCustomer = async (req, res, next) => {
    try {
        let body = req.body;
        let requires = [
            'password',
            'uniqueId'
        ];
        let errors = [];
        _.each(requires, function (param) {
            if (!_.has(body, param))
                errors.push(param);
        })
        if (errors.length > 0) {
            res.status(400).send({code: 0, message: 'Missing field: ' + errors.toString()});
        } else {
            const customer = await Customer.findByCredentials(req.body.phone, req.body.password);
            if (!customer) {
                return res.status(401).send({error: 'Login failed ! Check authentication credentials'})
            }
            let token = await Token.findOne({uniqueId: body['uniqueId']});
            if (!token) {
                token = new Token();
                token.userId = customer._id;
                token.token = jwt.sign({_id: customer._id}, process.env.TOKEN_SEC_KEY);
                token.uniqueId = body['uniqueId'];
                await token.save();
            } else {
                token.token = jwt.sign({_id: customer._id}, process.env.TOKEN_SEC_KEY);
                await token.save();
            }
            let user = JSON.parse(JSON.stringify(customer));
            user['token'] = token.token;
            // const cookieUser = [];
            // cookieUser.push('');
            // res.cookie("nameUser",user['nameUser']);
            // res.send("Cookie is set")
            // res.cookie("is_login111",true);
            res.status(200).send(user);
        }
    } catch (error) {
        console.log(error);
        res.status(400).send(error);
    }
}

//get profile
exports.getProfile = async (req, res, next) => {
    try {
        let body = req.body;
        let requires = [
            'token'
        ];
        let errors = [];
        _.each(requires, function (param) {
            if (!_.has(body, param))
                errors.push(param);
        });
        if (errors.length > 0) {
            res.json({code: 0, message: 'Missing field: ' + errors.toString()});
        } else {
            const tokenData = jwt.verify(body['token'], process.env.TOKEN_SEC_KEY);
            if (!_.has(tokenData, '_id')) {
                res.json({code: 0, message: 'Token invalid'});
            } else {
                // let customerId = mongoose.Types.ObjectId(tokenData['_id']);
                let id = tokenData['_id'];
                let obj = await Customer.findOne({_id: id}).exec();
                console.log(obj)
                res.json(obj)
            }
        }

    } catch (error) {
        res.json(error);
    }
}

exports.sendCodeVerify = async (req, res, next) => {
    try {
        let obj = req.body;
        let phone = await Customer.findOne({phone: obj['phone']});
        if (!phone) {
            // res.json({ code: 0, message: 'Số điện thoại không tồn tại!'  });
            res.send("Số điện thoại không tồn tại")
        } else {
            let b = "";
            for (let i = 0; i < 6; i++) {
                const a = Math.floor(Math.random(0, 9) * 10);
                b += a;
            }
            console.log(b)
            let payload = {
                Phone: phone['phone'],
                Content: "Mã xác thực của bạn là: " + b,
                ApiKey: apiKey,
                SecretKey: secretKey,
                SmsType: "2",
                Brandname: "Test"
            }
            console.log(payload)
            const params = new url.URLSearchParams(payload);
            console.log(params)
            let res = await axios.get(`http://rest.esms.vn/MainService.svc/json/SendMultipleMessage_V4_get?${params}`);
            console.log(res)
            let data = res.data;
            console.log(data);
        }


    } catch (e) {
        res.status(400).send(e);
    }
}

exports.postRePassword = async (req, res, next) => {
    try {
        let body = req.body;
        let requires = [
            'token'
        ];
        let errors = [];
        _.each(requires, function (param) {
            if (!_.has(body, param))
                errors.push(param);
        });
        if (errors.length > 0) {
            res.json({code: 0, message: 'Missing field: ' + errors.toString()});
        } else {
            const tokenData = jwt.verify(body['token'], process.env.TOKEN_SEC_KEY);
            if (!_.has(tokenData, '_id')) {
                res.json({code: 0, message: 'Token invalid'});
            } else {
                const salt = await bcrypt.genSalt(10);
                const customer = {
                    password: await bcrypt.hash(req.body.password, salt),
                }
                let customerId = tokenData['_id'];
                console.log(customerId)
                Customer.findByIdAndUpdate(customerId, customer, function (err) {
                    if (err) {
                        res.json(err)
                    } else {
                        res.json({customer, msg: "Doi mat khau thành công"});
                    }
                })
            }
        }
    } catch (error) {
        res.json(error);
    }
}
exports.postForgotPass = async (req, res, next) => {
    try {
        let body = req.body;
        let requires = [
            'phone'
        ];
        let errors = [];
        _.each(requires, function (param) {
            if (!_.has(body, param))
                errors.push(param);
        });
        if (errors.length > 0) {
            res.json({code: 0, message: 'Missing field: ' + errors.toString()});
        } else {
            const customer = await Customer.findOne({phone: body['phone']})
            const salt = await bcrypt.genSalt(10);
            const pass = {
                password: await bcrypt.hash(req.body.password, salt),
            }

            Customer.findByIdAndUpdate(customer, pass, function (err) {
                if (err) {
                    res.json(err)
                } else {
                    res.json({customer, msg: "Cập nhật mật khẩu thành công"});
                }
            })
        }
    } catch (error) {
        res.json(error);
    }
}

//post logout one device
exports.postLogOut = async (req, res, callback) => {
    let sess = req.session.customer;
    if (sess) {
        req.session.customer = null;
        return callback(null, {'success': true, "message": "user logout successfully"});
    }
    callback(null, {'success': true, "message": "user logout successfully"});
}

//post logout all device
exports.postLogOutAll = async (req, res, next) => {
    try {
        req.customer.tokens.splice(0, customer.tokens.length);
        await req.customer.save();
        res.send();
    } catch (error) {
        res.status(500).send(error);
    }
}
