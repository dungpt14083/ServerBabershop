const Order = require('../models/order');
const _ = require("underscore");
const jwt = require("jsonwebtoken");
const Service = require("../models/service");
const mongoose = require("mongoose");
const noti = require("../controller/notification_controller");

exports.getList = async (req, res, next) => {
    try {
        let limit = parseInt(req.query.limit)
        let page = parseInt(req.query.page)

        if (limit == NaN || !limit || limit < 0) limit = 10
        if (page == NaN || !page || page <= 0) page = 1

        const offset = (page - 1) * limit
        // console.log("query = ",req.query, limit , offset)
        const list = await Order.aggregate([
            {
                $addFields: {
                    stylistId: {$toObjectId: "$stylistId"},
                    // customerId: {$toObjectId: "$customerId"}
                }
            },
            {
                $lookup: {
                    from: "hairstylists",
                    localField: "stylistId",
                    foreignField: "_id",
                    as: "stylelist"
                }
            },
            {
                $unwind: {
                    path: "$stylelist",
                    preserveNullAndEmptyArrays:true
                }
            },
            {
                $lookup: {
                    from: "customers",
                    localField: "customerId",
                    foreignField: "_id",
                    as: "customer"
                }
            },
            {
                $unwind: {
                    path: "$customer",
                    preserveNullAndEmptyArrays:true
                }
            },
            {
                $project:
                    {
                        _id: 1,
                        status: 1,
                        time: 1,
                        totalTime: 1,
                        note: 1,
                        sumPrice: 1,
                        customerId: 1,
                        serviceIds: 1,
                        nameStylist: "$stylelist.nameStylist",
                        description: "$stylelist.description",
                        nameUser: "$customer.nameUser",

                    }
            }, {
                $sort: {_id: -1}
            }
        ]).skip(offset).limit(limit);

        // console.log(list)
        for (let i = 0; i < list.length; i++) {
            list[i].nameServices = []
            for (let j = 0; j < list[i].serviceIds.length; j++) {
                const data_service = await Service.findById(list[i].serviceIds[j]).lean()
                if (data_service) {
                    list[i].nameServices.push(data_service.nameService)
                }
            }
        }
        const today = new Date();

        let day = today.toString().substring(8, 10);
        let mon = today.toString().substring(4, 7);
        let year = today.toString().substring(11, 15);
        let time_ss = day + "/" + mon + "/" + year;

        let t_day;
        let t_mon;
        let t_year;

        let t;
        let tss;

        let dem = -1;
        const listOder = new Array();

        for (let i = 0; i < list.length; i++) {

            t = list[i].time;

            t_day = t.toString().substring(8, 10);
            t_mon = t.toString().substring(4, 7);
            t_year = t.toString().substring(11, 15);

            tss = t_day + "/" + t_mon + "/" + t_year;

            if (tss == time_ss) {
            }
            dem++;
            listOder[dem] = list[i];
        }

        const count = await Order.countDocuments()
        return res.render('./order/list_order', {listOder, limit, count, page, length: listOder.length});
    } catch (e) {
        console.error(e)
    }
}

exports.getTopStylist = async (req, res, next) => {
    let obj = await Order.aggregate([

        {
            $addFields: {
                stylistId: {$toObjectId: "$stylistId"},
                customerId: {$toObjectId: "$customerId"}
            }
        },
        {
            $lookup: {
                from: "hairstylists",
                localField: "stylistId",
                foreignField: "_id",
                as: "stylelist"
            }
        },
        {
            $unwind: {
                path: "$stylelist"
            }
        },
        {
            $match:{
                $or:[{"stylelist.status":0},{"stylelist.status":1}]
            }
        },
        {

            $lookup: {
                from: "customers",
                localField: "customerId",
                foreignField: "_id",
                as: "customer"
            }
        },
        {
            $unwind: {
                path: "$customer"
            }
        },
        {
            $project:
                {
                    _id: 1,
                    customerId: 1,
                    serviceIds: 1,
                    stylistId: 1,
                    nameStylist: "$stylelist.nameStylist",
                    description: "$stylelist.description",//
                    imageStylist: "$stylelist.imageStylist",
                    nameUser: "$customer.nameUser",
                    status: "$stylelist.status"
                }
        },
        {
            $group: {
                "_id": "$stylistId",
                "nameStylist": {"$first": "$nameStylist"},
                "imageStylist": {"$first": "$imageStylist"},
                "description": {"$first": "$description"},
                "count": {$sum: 1},
            },
        },

        {
            $limit: 5,
        }
    ]).sort({count: -1})
    res.json(obj);
}
exports.getTopServiceList = async (req, res, next) => {
    const obj = await Order.aggregate([
        {
            $unwind: {
                path: "$serviceIds"
            }
        },
        {
            $project:{
                _id:1,
                stylistId:1,
                status:1,
                time:1,
                totalTime:1,
                note:1,
                customerId:1,
                sumPrice:1,
                serviceId:"$serviceIds"
            }
        },
        {
            $group:{
                _id:"$serviceId",
                count:{$sum:1}
            }
        },
        {
            $addFields:{
                "serviceId":{$toObjectId:"$_id"}
            }
        },
        {
            $lookup:{
                from:"services",
                localField:"serviceId",
                foreignField:"_id",
                as:"service"
            }
        },
        {
            $unwind:{
                path:"$service"
            }
        },
        {
            $match:{
                "service.statusService":0
            }
        },
        {
            $project:{
                _id:1,
                count:1,
                name:"$service.nameService",
                price:"$service.price",
                workTime:"$service.workTime",
                images:"$service.images",
                describe:"$service.describe",

            }
        },
        {
            $sort:{
                count:-1
            }
        }

    ])
    console.log(obj)
    res.json(obj);
}

exports.apiGetAll = async (req, res, next) => {
    const obj = await Order.find().populate('customerId');
    res.json(obj);
}

exports.getAdd = (req, res, next) => {
    res.render('./order/add_order');
}

exports.getHistoryOrder = async (req, res, next) => {
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
            const customer_id = tokenData['_id']
            try {

                const history = await Order.aggregate([
                    {
                        $addFields: {
                            stylistId: {$toObjectId: "$stylistId"},
                            customerId: {$toObjectId: "$customerId"}
                        }
                    },
                    {
                        $match: {
                            customerId: mongoose.Types.ObjectId(customer_id),
                            status: 1
                        }
                    },
                    {
                        $lookup: {
                            from: "hairstylists",
                            localField: "stylistId",
                            foreignField: "_id",
                            as: "stylelist"
                        }
                    },
                    {
                        $unwind: {
                            path: "$stylelist"
                        }
                    },
                    {

                        $lookup: {
                            from: "customers",
                            localField: "customerId",
                            foreignField: "_id",
                            as: "customer"
                        }
                    },
                    {
                        $unwind: {
                            path: "$customer"
                        }
                    },

                    {
                        $project:
                            {
                                _id: 1,
                                status: 1,
                                time: 1,
                                totalTime: 1,
                                note: 1,
                                sumPrice: 1,
                                customerId: 1,
                                serviceIds: 1,
                                nameStylist: "$stylelist.nameStylist",
                                description: "$stylelist.description",
                                nameUser: "$customer.nameUser"
                            }
                    }
                ])
                for (let i = 0; i < history.length; i++) {
                    history[i].nameServices = []
                    for (let j = 0; j < history[i].serviceIds.length; j++) {
                        const data_service = await Service.findById(history[i].serviceIds[j]).lean()
                        if (data_service) {
                            history[i].nameServices.push(data_service.nameService)
                        }

                    }
                }

                res.json(history);
            } catch (e) {
                console.error(e)
            }
        }
    }
}

exports.postAdd = async (req, res, next) => {
    let body = req.body;
    let requires = [
        'token',
        'stylistId',
        'serviceIds',
        'time'
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
            let ids = JSON.parse(body['serviceIds']);// lấy ra danh sách dịch vụ đa
            let services = await Service.find().where('_id').in(ids).exec();
            let times = 0;
            for (let i = 0; i < services.length; ++i) {
                times += services[i].workTime;
            }
            let order = new Order(body);
            order.serviceIds = ids;
            order.customerId = tokenData['_id'];
            order.totalTime = times;
            order.note = req.body.note;
            await order.save();
            res.json(order);
            const topicId = req.body.topicId;
            if (topicId == null) {
                console.log("Request faild !!");
            } else {
                const body = req.body.body;
                const title = req.body.title
                await noti.pushNotification(topicId, body, title);
            }
            // let startDay = new Date().setHours(0, 0, 0, 0);
            // let endDay = new Date().setHours(23, 59, 59, 0);
            // let orders = await Order.find({
            //     stylistId: body['stylistId'],
            //     time: {
            //         $gte: startDay,
            //         $lt: endDay
            //     },
            //     status: 1}).sort({time:-1}).exec();
            // let isBusy = false;
            // for (let i = 0; i < orders.length; ++i) {
            //     let regTime = new Date(body['time']).getTime();
            //     let startTime = orders[i].time.getTime();
            //     let endTime = orders[i].time.setMinutes(orders[i].time.getMinutes() + orders[i].totalTime);
            //     if (regTime > startTime && regTime < endTime) {
            //         isBusy = true;
            //         break;
            //     }
            // }
            // if (isBusy) {
            //     res.json({ code: 0, message: 'Stylist is busy' });
            // } else {
            //
            // }
        }
    }
}


exports.post_XacNhan_Order = async (req, res, next) => {

    let _id = req.params.id;
    let order = {
        status: null,
    }
    order.status = 1;

    Order.findByIdAndUpdate(_id, order, function (err) {
        if (err) {
            console.log(err)
        } else {
            noti.pushNotification(_id, "Bạn đã thanh toán thành công \n Cảm ơn bạn đã tin dùng dịch vụ", "Xác nhận đặt lich");

            console.log("ghi du lieu thanh cong");
            res.redirect('back');
        }
    })

}


exports.searchByName = async (req, res, next) => {

    const name = req.body.namekhach;

    if (name.toString().length > 0) {

        try {
            const list = await Order.aggregate([
                {
                    $addFields: {
                        stylistId: {$toObjectId: "$stylistId"},
                        customerId: {$toObjectId: "$customerId"}
                    }
                },
                {
                    $lookup: {
                        from: "hairstylists",
                        localField: "stylistId",
                        foreignField: "_id",
                        as: "stylelist"
                    }
                },
                {
                    $unwind: {
                        path: "$stylelist"

                    }
                },
                {

                    $lookup: {
                        from: "customers",
                        localField: "customerId",
                        foreignField: "_id",
                        as: "customer"
                    }
                },
                {
                    $unwind: {
                        path: "$customer"
                    }
                },

                {
                    $project:
                        {
                            _id: 1, //1 là lấy ra
                            status: 1,
                            time: 1,
                            totalTime: 1,
                            note: 1,
                            sumPrice: 1,
                            customerId: 1,
                            serviceIds: 1,
                            nameStylist: "$stylelist.nameStylist",
                            description: "$stylelist.description",//
                            nameUser: "$customer.nameUser"
                        }
                }
            ])
            for (let i = 0; i < list.length; i++) {

                list[i].nameServices = []
                for (let j = 0; j < list[i].serviceIds.length; j++) {
                    const data_service = await Service.findById(list[i].serviceIds[j]).lean()
                    if (data_service) {
                        list[i].nameServices.push(data_service.nameService)
                    }

                }
            }

            let dem = -1;
            const listOder = new Array();
            let n;

            for (let i = 0; i < list.length; i++) {
                n = list[i].nameUser;
                if (n.toString().includes(name) == true) {
                    dem++;
                    listOder[dem] = list[i];
                }
            }

            return res.render('./order/list_order', {listOder: listOder});
        } catch (e) {
            console.error(e)
        }

    } else {
        return res.status(400).json({error: "Chua co du lieu tim kiem"});
    }

}

exports.searchByDay = async (req, res, next) => {

    let check;

    const t2 = req.body.tungay;
    const t1 = req.body.denngay;

    let den_day = t1.toString().substring(8, 11);
    let den_month = t1.toString().substring(5, 7);
    let den_year = t1.toString().substring(0, 4);

    let tu_day = t2.toString().substring(8, 11);
    let tu_month = t2.toString().substring(5, 7);
    let tu_year = t2.toString().substring(0, 4);


    if (Number(den_month) == 2) {

        if (Number(den_day) > 29) {
            check = "false";
        } else if (Number(den_day) == 29) {

            if ((Number(den_year) % 4 == 0 && Number(den_year) % 100 != 0 && Number(den_year) % 400 != 0) || (Number(den_year) % 100 == 0 && Number(den_year) % 400 == 0)) {
            } else {
                check = "false";
            }

        }
    } else if (Number(den_month) == 4 || Number(den_month) == 6 || Number(den_month) == 9 || Number(den_month) == 11) {
        if (Number(den_day) == 31) {
            check = "false";
        }
    }

    if (Number(tu_month) == 2) {
        if (Number(tu_day) > 29) {
            check = "false";
        } else if (Number(tu_day) == 29) {
            if ((Number(tu_year) % 4 == 0 && Number(tu_year) % 100 != 0 && Number(tu_year) % 400 != 0) || (Number(tu_year) % 100 == 0 && Number(tu_year) % 400 == 0)) {
            } else {
                check = "false";
            }

        }
    } else if (Number(tu_month) == 4 || Number(tu_month) == 6 || Number(tu_month) == 9 || Number(tu_month) == 11) {
        if (Number(tu_day) == 31) {
            check = "false";
        }
    }


    if (Number(tu_year) > Number(den_year)) {
        check = "false";
    } else if (Number(tu_year) == Number(den_year)) {
        if (Number(tu_month) > Number(den_month)) {
            check = "false";
        } else if (Number(tu_month) == Number(den_month)) {
            if (Number(tu_day) > Number(den_day)) {
                check = "false";
            } else {
                check = "true";
            }

        } else {
            check = "true";
        }
    } else {
        check = "true";
    }


    if (check == "true") {

        try {

            let limit = parseInt(req.query.limit)
            let page = parseInt(req.query.page)

            if (limit == NaN || !limit || limit < 0) limit = 10
            if (page == NaN || !page || page <= 0) page = 1

            const offset = (page - 1) * limit

            const list = await Order.aggregate([
                {
                    $addFields: {
                        stylistId: {$toObjectId: "$stylistId"},
                        customerId: {$toObjectId: "$customerId"}
                    }
                },
                {
                    $lookup: {
                        from: "hairstylists",
                        localField: "stylistId",
                        foreignField: "_id",
                        as: "stylelist"
                    }
                },
                {
                    $unwind: {
                        path: "$stylelist"

                    }
                },
                {

                    $lookup: {
                        from: "customers",
                        localField: "customerId",
                        foreignField: "_id",
                        as: "customer"
                    }
                },
                {
                    $unwind: {
                        path: "$customer"
                    }
                },

                {
                    $project:
                        {
                            _id: 1, //1 là lấy ra
                            status: 1,
                            time: 1,
                            totalTime: 1,
                            note: 1,
                            sumPrice: 1,
                            customerId: 1,
                            serviceIds: 1,
                            nameStylist: "$stylelist.nameStylist",
                            description: "$stylelist.description",//
                            nameUser: "$customer.nameUser"
                        }
                }, {
                    $sort: {_id: -1}
                }
            ]).skip(offset).limit(limit);
            for (let i = 0; i < list.length; i++) {
                list[i].nameServices = []
                for (let j = 0; j < list[i].serviceIds.length; j++) {
                    const data_service = await Service.findById(list[i].serviceIds[j]).lean()
                    if (data_service) {
                        list[i].nameServices.push(data_service.nameService)
                    }
                }
            }
            let day, month, year, t, m;
            let dem = -1;
            const listOder = new Array();
            for (let i = 0; i < list.length; i++) {
                t = list[i].time;
                day = t.toString().substring(8, 10);
                m = t.toString().substring(4, 7);
                year = t.toString().substring(11, 15);

                if (m == "Jan") {
                    month = "1";
                } else if (m == "Feb") {
                    month = "2";
                } else if (m == "Mar") {
                    month = "3";
                } else if (m == "Apr") {
                    month = "4";
                } else if (m == "May") {
                    month = "5";
                } else if (m == "Jun") {
                    month = "6";
                } else if (m == "Jul") {
                    month = "7";
                } else if (m == "Aug") {
                    month = "8";
                } else if (m == "Sep") {
                    month = "9";
                } else if (m == "Oct") {
                    month = "10";
                } else if (m == "Nov") {
                    month = "11";
                } else if (m == "Dec") {
                    month = "12";
                }

                if (Number(tu_year) == Number(year) && Number(year) == Number(den_year)) {

                    if (Number(tu_month) < Number(month) && Number(month) < Number(den_month)) {
                        dem++;
                        listOder[dem] = list[i];
                    }
                    else if (Number(tu_month) == Number(month) && Number(month) == Number(den_month)) {

                        if (Number(day) >= Number(tu_day) && Number(day) <= Number(den_day)) {
                            dem++;
                            listOder[dem] = list[i];
                        }
                    }
                    else if (Number(tu_month) == Number(month) && Number(month) < Number(den_month)) {
                        if (Number(day) >= Number(tu_day)) {
                            dem++;
                            listOder[dem] = list[i];
                        }
                    }
                    else if (Number(month) == Number(den_month) && Number(month) > Number(tu_month)) {
                        if (Number(day) <= Number(den_day)) {
                            dem++;
                            listOder[dem] = list[i];
                        }
                    }
                }
                else if(Number(tu_year) < Number(year) && Number(year) == Number(den_year)){
                    if (Number(month) < Number(den_month)) {
                        dem++;
                        listOder[dem] = list[i];
                    }
                    else if (Number(month) == Number(den_month)) {

                        if (Number(day) <= Number(den_day)) {
                            dem++;
                            listOder[dem] = list[i];
                        }
                    }
                }
                else if(Number(tu_year) == Number(year) && Number(year) < Number(den_year)){
                    if (Number(tu_month) < Number(month)) {
                        dem++;
                        listOder[dem] = list[i];
                    }
                    else if (Number(tu_month) == Number(month)) {

                        if (Number(day) >= Number(tu_day)) {
                            dem++;
                            listOder[dem] = list[i];
                        }
                    }
                }

            }

            if (dem >= 0) {
                const count = await Order.countDocuments()
                return res.render('./order/list_order', {listOder, limit, count, page, length: listOder.length});
            } else {
                return res.status(400).json({error: "Khong co lich nao"});
            }
        } catch (e) {
            console.error(e)
        }
    } else {
        return res.status(400).json({error: "Thong tin chua chinh xac"});
    }
}

exports.post_Huy_Order = async (req, res, next) => {

    let _id = req.params.id;
    let order = {
        status: null,
    }
    order.status = 2;

    Order.findByIdAndUpdate(_id, order, function (err) {
        if (err) {
            console.log(err)
        } else {
            console.log("ghi du lieu thanh cong");
            res.redirect('back');
        }
    })

}
