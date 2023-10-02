const StylistMDL = require('../models/hairStylist');
const _ = require("underscore");
const Order = require('../models/order');

exports.getList = async (req, res, next) => {
    const listStylist = await StylistMDL.find();
    res.render('./hairstylist/list_hairstylist', {listStylist: listStylist});
}

exports.postSearch = async (req, res, next) => {

    const name = req.body.nameSearch;
// a xem function search này được chưa ạ,
    if (name.length != 0) {
        const listStylist = await StylistMDL.find({nameStylist: {$regex: ".*" + name + ".*", $options: "i"}});
        // {nameStylist: {$regex: name, $options: 'i'}}
        res.render('./hairstylist/list_hairstylist', {listStylist: listStylist});
        // res.redirect('back',{listStylist: listStylist})
    } else {
        const listStylist = await StylistMDL.find();
        res.render('./hairstylist/list_hairstylist', {listStylist: listStylist});
        // res.redirect('back',{listStylist: listStylist})
    }
}

exports.getAll = async (req, res, next) => {
    const obj = await StylistMDL.find({status: 0});
    if (obj == null) {
        console.log("abcd")
    } else {
        res.json(obj);
    }
}
//Set status = 1 => ban
exports.setStatus1 =async (req, res, next) => {
    const params = req.params;
    let stylist = {
        status : null
    }
    stylist.status = 1;
    StylistMDL.findByIdAndUpdate(params['id'],stylist,function (err){
        if (err){
            console.log(err);
        }else {
            console.log("status = 1");
            res.redirect('back');
        }
    })
}
//Set status = 0 => ranh
exports.setStatus0 =async (req, res, next) => {
    const params = req.params;
    let stylist = {
        status : null
    }
    stylist.status = 0;
    StylistMDL.findByIdAndUpdate(params['id'],stylist,function (err){
        if (err){
            console.log(err);
        }else {
            console.log("status = 0");
            res.redirect('back');
        }
    })
}
//Set status = 2 => nghi viec
exports.setStatus2 =async (req, res, next) => {
    const params = req.params;
    let stylist = {
        status : null
    }
    stylist.status = 2;
    StylistMDL.findByIdAndUpdate(params['id'],stylist,function (err){
        if (err){
            console.log(err);
        }else {
            console.log("status = 2");
            res.redirect('back');
        }
    })
}
exports.getDetail = (req, res, next) => {
    res.render('./hairstylist/detail_hairstylist');
}

exports.getAdd = (req, res, next) => {
    res.render('./hairstylist/add_hairstylist');
}
exports.postAdd = (req, res, next) => {
    let objStylist = new StylistMDL({
        nameStylist: req.body.nameStylist,
        description: req.body.description,
    })
    if (req.file) {
        objStylist.imageStylist = req.file.path.replace('public\\', '');
    }
    objStylist.save(objStylist, function (err) {
        if (err) {
            console.log(err);
        } else {
            console.log("Add Stylist thanh cong");
        }
    })
    res.redirect('/hairstylist');

}


exports.getEdit = async (req, res, next) => {
    let obj = await StylistMDL.findById(req.params.id).exec().catch(function (err) {
        console.log(err);
    });
    console.log(obj)
    if (obj == null) {
        res.send('No Object Data');
    }
    res.render('./hairstylist/edit_hairstylist', {obj: obj});
}

exports.getStylistTime = async (req, res, next) => {
    let body = req.body;
    let requires = [
        'stylistId',
        'date'
    ];
    let errors = [];
    _.each(requires, function (param) {
        if (!_.has(body, param))
            errors.push(param);
    });
    console.log('2');
    if (errors.length > 0) {
        console.log('3');
        res.json({code: 0, message: 'Missing field: ' + errors.toString()});
    } else {
        let stylistId = body['stylistId'];
        let date = new Date(body['date']);
        let startDay = date.setHours(0, 0, 0, 0);
        let endDay = date.setHours(23, 59, 59, 59);
        let orders = await Order.find({
            stylistId: stylistId,
            time: {
                $gte: startDay,
                $lt: endDay
            }
        }).sort({time: -1}).exec();
        let orderTimeSteps = [];
        for (let i = 0; i < orders.length; ++i) {
            let totalTime = orders[i].totalTime;
            let startTime = orders[i].time;
            let stepCount = Math.ceil(totalTime / 30);
            if (startTime.getMinutes() == 0) {
                for (let j = 0; j < stepCount; ++j) {
                    orderTimeSteps.push(startTime.getHours() * 2 + j);
                }
            } else {
                for (let j = 0; j < stepCount; ++j) {
                    orderTimeSteps.push(startTime.getHours() * 2 + j + 1);
                }
            }
        }
        res.json(orderTimeSteps);
    }
}

exports.postEdit = (req, res, next) => {

    console.log(req.body);

    let dieukien = {
        _id: req.params.id
    }
    let img;
    if (req.file) {
        img = req.file.path.replace('public\\', '');
    }
    let dulieu = {
        nameStylist: req.body.nameStylist,
        description: req.body.description,
        imageStylist: img
    }
    StylistMDL.updateOne(dieukien, dulieu, function (err) {
        if (err) {
            console.log(err)
        } else {
            console.log("ghi du lieu thanh cong");
            res.redirect('back');
        }

    });

}


exports.getDelete = async (req, res, next) => {

    console.log(req.params);

    let itemStylist = await StylistMDL.findById(req.params.id)
        .exec()
        .catch(function (err) {
            console.log(err);
        });

    console.log(itemStylist);

    if (itemStylist == null) {
        res.send('Khong co Stylist tuong ung');
    }
    res.render('./hairstylist/delete_hairstylist', {itemStylist: itemStylist});
}

exports.postDelete = (req, res, next) => {
    StylistMDL.deleteOne({_id: req.params.id}, function (err) {
        if (err) {
            console.log(err);
        } else {
            console.log('Delete Thanh Cong');
            res.redirect('back');
        }
    });

}