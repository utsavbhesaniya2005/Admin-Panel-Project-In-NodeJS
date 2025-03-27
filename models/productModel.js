const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    pname : {
        type : String,
        required : true,
    },
    description : {
        type : String,
        required : true,
    },
    category : {
        type : String,
        required : true,
    },
    expireDate : {
        type : Date,
        required : true,
    },
    stock : {
        type : Number,
        required : true, 
    },
    price : {
        type : Number,
        required : true, 
    },
    productImage : {
        type : String,
        requierd : true,
    },
    adminId : {
        type : mongoose.Schema.ObjectId,
        ref : 'users',
        require : true, 
    },
});

const productModel = mongoose.model('products', productSchema);

module.exports = productModel;
