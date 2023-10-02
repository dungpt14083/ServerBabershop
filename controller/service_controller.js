const ServiceMDL = require('../models/service');
const _ = require('underscore');


//search
exports.postSearch = async (req, res, next) => {
    const nameService = req.body.searchService;
    if (nameService.length != 0) {
        const listService = await ServiceMDL.find({nameService: {$regex: ".*" + nameService + ".*", $options: "i"}});
        res.render('./service/list_service', {listService: listService});
    } else {
        const listService = await ServiceMDL.find();
        res.render('./service/list_service', {listService: listService});
    }
}

exports.getAllService = async (req, res, next) => {
    let obj = await ServiceMDL.find({statusService: 0});
    res.json(obj);
}


exports.getList = async (req, res, next) => {
    let listService = await ServiceMDL.find();
    res.render('./service/list_service', {listService: listService});
}
exports.getDetail = (req, res, next) => {
    res.render('./service/detail_service')
}
//add
exports.getAdd = (req, res, next) => {
    res.render('./service/add_service');
}
exports.postAdd = (req, res, next) => {
    // let body = req.body;
    // let requires = [
    //     'nameService',
    //     'price',
    //     'workTime'
    // ];
    // let errors = [];
    // _.each(requires, function (param) {
    //     if (!_.has(body, param))
    //         errors.push(param);
    // })
    // if (errors.length > 0) {
    //     res.status(400).send({code: 0, message: 'Missing field: ' + errors.toString()});
    // }else {
    //
    // }
    let serviceObj = new ServiceMDL({
        nameService: req.body.nameService,
        price: req.body.price,
        workTime: req.body.workTime,
        describe: req.body.describe,
    })
    if (req.file) {
        serviceObj.images = req.file.path.replace('public\\', '');
    }
    serviceObj.save(serviceObj, function (err) {
        if (err) {
            console.log(err);

        } else {
            console.log("Ghi dữ liệu thành công");
        }
    })
    console.log(req.file);


    res.redirect('/service');
}

//update
exports.getUpdateService = async (req, res, next) => {

    let itemService = await ServiceMDL.findById(req.params.id)
        .exec()
        .catch(function (err) {
            console.log(err);
        })
    if (itemService == null) {
        res.send("No Object Data");
    }
    res.render('./service/edit_service', {itemService: itemService});


}
exports.postUpdate = async (req, res, next) => {
    console.log(req.body);

    let dieu_kien = {
        _id: req.params.id
    }
    let img;
    if (req.file) {
        img = req.file.path.replace('public\\', '');
    }
    let dulieu = {
        nameService: req.body.nameService,
        price: req.body.price,
        workTime: req.body.workTime,
        describe: req.body.describe,
        images: img
    }
    ServiceMDL.updateOne(dieu_kien, dulieu, function (err) {
        if (err) {
            console.log(err)
        } else {
            console.log("ghi du lieu thanh cong");
            res.redirect('back');
        }
    });
}
//update status
exports.setStatus = (req, res, next) => {
    const param = req.params;
    const service = {
        statusService: null,
    }
    service.statusService = 1;
    ServiceMDL.findByIdAndUpdate(param['id'], service, function (err) {
        if (err) {
            console.log(err);
        } else {
            console.log("set status successfully");
            res.redirect('back');
        }
    })
}
// //delete
exports.postDelete = (req, res, next) => {
    ServiceMDL.deleteOne({_id: req.params.id}, function (err) {
        if (err) {
            console.log(err)
        } else {
            console.log('Xoa thanh cong');
            res.redirect('back');
        }
    })
}


