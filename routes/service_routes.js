var express = require('express');
var Servicerouter = express.Router();
var serviceCTL = require('../controller/service_controller');
const upload=require("../middleware/upload")
var auth = require('../middleware/middleware');

Servicerouter.get('/',serviceCTL.getList);
Servicerouter.post('/',auth.LoginRequire,serviceCTL.postSearch);

Servicerouter.get('/detail',serviceCTL.getDetail);
Servicerouter.get('/add',auth.LoginRequire,serviceCTL.getAdd);
Servicerouter.post('/add',auth.LoginRequire,upload.single('images'),serviceCTL.postAdd);


// router.get('/edit/:id',auth.LoginRequire,service.getUpdateService);
Servicerouter.put('/edit/:id',auth.LoginRequire,upload.single('images'),serviceCTL.postUpdate);
Servicerouter.delete('/delete/:id',auth.LoginRequire,serviceCTL.postDelete)
Servicerouter.put('/statusService/:id',serviceCTL.setStatus);
Servicerouter.get('/get-all',serviceCTL.getAllService);
module.exports = Servicerouter;