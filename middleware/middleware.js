exports.LoginRequire = (req, res, next) => {
    if (req.session.customer) {
        next();
    } else {
        res.redirect('/admin/login');
    }
}
exports.NoLogin = (req, res, next) => {
    if (!req.session.customer) {
        next();
    } else {
        res.redirect('/order');
    }
}