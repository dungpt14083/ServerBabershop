var Customer = require('../models/customer');
var bcrypt = require('bcrypt');


exports.getLogin = (req, res, next) => {
    // res.render('./login',{currentManager:req.session.nameManager});
    console.log("????")
    res.render('./admin/loginAdmin', {error: req.session.error});
    // req.session.destroy()
}
exports.postLogin = async (req, res, next) => {
    const body = req.body;
    // if (!body.adphone || parseInt(body.adphone) == NaN) {
    //     req.session.error = "Please check your Password2!"
    //     return res.redirect("/admin/login")
    // }
    const admin = await Customer.findOne({phone: body['adphone']});
    if (admin) {
        if (admin.accessLv != 1){
            return res.status(400).json({error: "Bạn không có quyền truy nhập"});
        }else {
            const validPassword = await bcrypt.compare(body.adpass, admin.password);
            if (validPassword) {
                req.session.customer = admin;
                res.cookie("is_login",true)
                return res.redirect('/');
            } else {
                return res.status(400).json({error: "Sai mật khẩu"});
            }
        }
    } else {
        return res.status(400).json({message: "Sai tài khoản"});
    }
}

exports.postLogout = ( req,res, next) => {
    // try{
    //     res.cookie("is_login",false)
    //     return res.redirect('/');
    // }
    // catch (e){
    //     console.error(e)
    // }
    req.session.destroy(function () {
        res.cookie("is_login",false)
        return res.redirect('/admin/login');
    });


}