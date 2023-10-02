var express = require('express');
var routes = express.Router();
const newfeed = require('../controller/newfeed_controller');
const upload = require('../middleware/upload')

var auth = require('../middleware/middleware');

routes.get('/',newfeed.getList);
routes.post('/',auth.LoginRequire,newfeed.postSearch);
routes.get('/add',auth.LoginRequire,newfeed.getAdd);
routes.post('/add',auth.LoginRequire,upload.array('image',10),newfeed.postAdd);
// routes.get('/edit/:id',newfeed.getEdit);
routes.put('/edit/:id',auth.LoginRequire,upload.array('imageNewfeed',10),newfeed.postEdit);
routes.get('/detail',auth.LoginRequire,newfeed.getDetail);
routes.delete('/delete/:id',auth.LoginRequire,newfeed.postDelete)
routes.get('/get-all',newfeed.getAll);
module.exports = routes;