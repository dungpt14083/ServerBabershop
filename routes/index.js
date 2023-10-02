var express = require('express');
var router = express.Router();
const mdl = require("../middleware/middleware")
const thongKe = require('../controller/thongsgke_controller');
const Order = require('../controller/order_controller');
const Stylist = require('../controller/hairStylist_controller');

router.get('/',mdl.LoginRequire,thongKe.ThongKeOrder);


module.exports = router;
