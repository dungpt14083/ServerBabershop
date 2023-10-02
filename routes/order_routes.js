const express = require('express');
const routes = express.Router();
const multer = require('multer');

const Order = require('../controller/order_controller');
const service = require("../controller/service_controller");
const StylistCTL = require("../controller/hairStylist_controller");

const mdl = require("../middleware/middleware")


routes.get('/',mdl.LoginRequire,Order.getList);

routes.get('/add',mdl.LoginRequire,Order.getAdd);
routes.post('/add',Order.postAdd);

routes.get('/get-all',Order.apiGetAll)

routes.post('/history',Order.getHistoryOrder);

routes.put('/status/:id',Order.post_XacNhan_Order);

routes.post('/', Order.searchByDay);

routes.get('/topStylist' , Order.getTopStylist);
routes.get('/topService' , Order.getTopServiceList);


routes.post('/status/:id',Order.post_Huy_Order);
// routes.put('/status/:id',Order.post_Done_Order);

// routes.delete('/delete/:id',Order.postDelete);

// routes.post('/',Order.searchOrder);

// routes.post('/xac_nhan/:id' , Order.postAddBill);
// routes.get('/edit/:id',Order.getEdit);
// routes.get('/edit/:id',Order.getEdit);
// routes.post('/edit/:id',Order.postEdit);
//
// routes.get('/detail/:id',Order.getDetail)


module.exports = routes;