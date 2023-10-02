const Stylist = require('../models/hairStylist');
const Order =  require('../models/order');
const mongoose = require('mongoose');
const StylistMDL = require("../models/hairStylist");
const Services = require("../models/service")


exports.ThongKeOrder = async (req,res,next)=>{

    const listOrder = await Order.find();
    const listStylist = await StylistMDL.find();
    const listServices = await Services.find();

    res.render('./thongke/thongke' , {listOrder:listOrder , listStylist:listStylist , listServices:listServices});

}