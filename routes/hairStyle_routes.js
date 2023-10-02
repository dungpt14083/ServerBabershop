var express = require('express');
var stylistRouter = express.Router();
var multer = require('multer');
var StylistCTL = require('../controller/hairStylist_controller');
const upload = require('../middleware/upload')
const auth = require('../middleware/middleware')

stylistRouter.get('/',StylistCTL.getList);
stylistRouter.get('/detail',StylistCTL.getDetail);
stylistRouter.get('/get-all',StylistCTL.getAll);
stylistRouter.get('/add',auth.LoginRequire,StylistCTL.getAdd);
stylistRouter.post('/add',auth.LoginRequire,upload.single('imageStylist'),StylistCTL.postAdd);
stylistRouter.post('/',auth.LoginRequire,StylistCTL.postSearch);
stylistRouter.post('/stylist-time',StylistCTL.getStylistTime);
stylistRouter.put('/edit/:id',auth.LoginRequire,upload.single('imageStylist'),StylistCTL.postEdit);
stylistRouter.delete('/delete/:id',auth.LoginRequire,StylistCTL.postDelete);
stylistRouter.put('/status1/:id',StylistCTL.setStatus1);
stylistRouter.put('/status0/:id',StylistCTL.setStatus0);
stylistRouter.put('/status2/:id',StylistCTL.setStatus2);

module.exports = stylistRouter;