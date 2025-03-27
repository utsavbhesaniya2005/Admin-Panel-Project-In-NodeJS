const mongoose = require('mongoose');

const activitySchema = await mongoose.Schema({

    createdAt : {
        type : Date,
        default : Date.now,
    },
    status : {
        type : String,
    },
    productId : {
        type : mongoose.Schema.ObjectId,
        ref : 'products',
        required : true,
    },

});

const activityModel = mongoose.model('activities', activitySchema);

module.exports = activityModel;
