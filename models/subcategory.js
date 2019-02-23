const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const SubCategorySchema = new Schema({
    title: {
        type: String,
        required: true
    },
    description : {
        type: String,
        reequired: true
    }, 
    bannerImage: {
        type: String
    },
    catId:{
        type:Schema.Types.ObjectId,
        ref: 'category'
    },
    subscriberCount:{
        type: Number 
    },
    upvotes: [
        {
            type: Schema.Types.ObjectId,
            ref: 'users'
        }
    ],
    downvotes: [
        {
            type: Schema.Types.ObjectId,
            ref: 'users'
        }
    ],
    postCount: {
        type: Number
    }
});

const SubCategoryModel = mongoose.model('subcategory', SubCategorySchema);
module.exports = SubCategoryModel;