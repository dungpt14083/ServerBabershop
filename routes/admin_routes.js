var express = require('express');
var router = express.Router();
const {route} = require("express/lib/router");
var admin_ctl = require('../controller/admin_controller');
const mdl = require("../middleware/middleware")

router.get('/login',mdl.NoLogin,admin_ctl.getLogin);
router.post('/login',mdl.NoLogin,admin_ctl.postLogin); // cái này là admin/login đó hả vaang a
router.get('/logout',admin_ctl.postLogout);

module.exports = router;