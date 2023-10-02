const mongoose = require('mongoose');
mongoose.connect('mongodb+srv://thucnguyen1907:thucnguyen1907@cluster0.qwzlcau.mongodb.net/ServerHairCut');
const service = new mongoose.Schema({
    nameService : {
        type:'String',
        require:true
    },
    price :{
        type: Number,
    },
    workTime :{
        type: Number,
    },
    statusService:{
        type:Number,
        default:0,
    }
    ,
    describe:{
        type:'String',
    },
    images:{
        type:"String",
    },
    createAt:{
        type: Date,
        default: Date.now()
    }
    // timestamps: {
    //     createdAt: 'created_at',
    //     updatedAt: 'updated_at'
    // }
});
const Service = mongoose.model('Service',service);
module.exports = Service;