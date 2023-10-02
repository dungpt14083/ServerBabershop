const Newfeed = require('../models/newfeed');
var _ = require('underscore');

//api getall
exports.getAll =async (req,res,next) => {
    let obj = await Newfeed.find();
    res.json(obj);
}

exports.postSearch = async (req, res, next) => {

    const name = req.body.nameNewfeed;
    if (name.length != 0) {
        const listNewfeed = await Newfeed.find({title: {$regex:".*"+name+".*",$options:"i"}});
        res.render('./newfeed/list_newfeed', {listNewfeed: listNewfeed});
    } else {
        const listNewfeed = await Newfeed.find();
        res.render('./newfeed/list_newfeed', {listNewfeed: listNewfeed});
    }
}

exports.getList = async (req, res, next) => {
    var listNewfeed = await Newfeed.find();
    res.render('./newfeed/list_newfeed', {listNewfeed: listNewfeed});
}

exports.getAdd = (req, res, next) => {
    res.render('./newfeed/add_newfeed');
}

exports.postAdd = async (req, res, next) => {
    const objNewfeed = new Newfeed({
        title: req.body.title,
        contentTitle: req.body.contentTitle,
        description: req.body.description
    })
    if (req.files) {
        objNewfeed.image = [];
        _.each(req.files, (file) => {
            objNewfeed.image.push(file.path.replace('public\\', ''));
        })
        await objNewfeed.save(function (err) {
            if (err) {
                console.log(err)
            } else {
                console.log("ghi du lieu thanh cong");
            }
            res.redirect('/newfeed');
        })
    }
}

exports.getEdit = async (req, res, next) => {
    let obj = await Newfeed.findById(req.params.id).exec().catch(function (err) {
        console.log(err);
    })
    if (obj == null) {
        res.send("No Object Data");
    }
    res.render('./newfeed/edit_newfeed', {obj: obj})
}
//backend a
exports.postEdit = async (req, res, next) => {
    let images= [];
    if (req.files) {
        _.each(req.files, (file) => {
           images.push(file.path.replace('public\\', ''));
        })
    }
    let dieukien={
        _id : req.params.id
    }
    let data = {
        title: req.body.title,
        contentTitle: req.body.contentTitle,
        description: req.body.description,
        image : images,
    }
     Newfeed.updateOne(dieukien,data,function (err) {
        if (err) {
            console.log(err)
        } else {
            console.log("ghi du lieu thanh cong");
            res.redirect('back');
        }

    })
}
exports.getDetail = (req, res, next) => {
    res.render('./newfeed/detail_newfeed');
}
exports.postDelete = (req,res,next)=>{
    Newfeed.deleteOne({_id:req.params.id},function (err) {
        if (err){
            console.log(err)
        }else {
            console.log('Xoa thanh cong');
            res.redirect('back');
        }
    })
}
