const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const methodOverride = require('method-override');

var session = require('express-session');

const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');
const orderRouter = require('./routes/order_routes');
const hairStylistRouter = require('./routes/hairStyle_routes');
const customerRouter = require('./routes/customer_routes');
const serviceRouter = require('./routes/service_routes');
const adminRouter = require('./routes/admin_routes');
const newfeedRouter = require('./routes/newfeed_routes');
const thongkeRouter = require('./routes/thongke_routes')

const Customer = require('./models/customer');
const bcrypt = require("bcrypt");


const app = express();
// view engine setup
// const hbs = create({
//   helpers: {
//     sum:(a,b)=>a+b,
//   }
// })

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');
app.use(methodOverride('_method'));
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(session({
    secret: 'fksdfn24235bdInfsdHSNF3414',
    resave: true,
    saveUninitialized: true,
    // proxy:true,
    // cookie: {secure : true, maxAge : 8 * 60 * 60 *1000,sameSite: "none", httpOnly:false},
    // credentials:true,
}));

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/order', orderRouter);
app.use('/hairstylist', hairStylistRouter);
app.use('/customer', customerRouter);
app.use('/service', serviceRouter);
app.use('/admin', adminRouter);
app.use('/newfeed', newfeedRouter);
app.use('/thongke', thongkeRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
    next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render('error');
});

// Check admin existed


async function checkAdminExist(res) {
    let admin = await Customer.findOne({phone: '0123456789'});
    if (!admin) {
        const salt = await bcrypt.genSalt(10);
        admin = new Customer();
        admin.phone = '0123456789';
        admin.password = await bcrypt.hash('123456', salt);
        admin.accessLv = 1;
        admin.nameUser = "Admin"
        admin.image ='uploads/admin.jpg'
        console.log(admin)
        await admin.save();

    }
}

exports = checkAdminExist();
module.exports = app;
