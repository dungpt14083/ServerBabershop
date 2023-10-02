const path = require('path')
const multer = require('multer')
var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'public/uploads');
    },
    filename: function (req, file, cb) {
        let ext = path.extname(file.originalname);
        cb(null, Date.now() + '_' + file.originalname);
    }
})
var upload = multer({
    storage: storage,
    fileFilter: function (req, file, callback) {
        if (!file.originalname.match(/\.(jpg|JPG|jpeg|JPEG|png|PNG|gif|GIF)$/)) {
            req.fileValidationError = 'Only image files are allowed!'
            return callback(new Error('Only image files are allowed!'))
        }
        callback(null,true)
    },
    limits: {
        fileSize: 1024 * 1024 * 10
    }
})
module.exports = upload