const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const PostSchema = new Schema({
    title:{
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    subCatId:[{
        type: Schema.Types.ObjectId,
        ref: 'subcategory'
    }],
    user:{
        type: Schema.Types.ObjectId,
        ref: 'user'
    },
    postedBy: {
        type: String,
        required: true
    },
    link: {
        type: String,
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
    comment: [{
        user: {
            type: Schema.Types.ObjectId,
            ref: 'users'
        },
        text: {
            type: String,
            required: true
        },
        name: {
            type: String
        },
        date: {
            type: Date,
            default: Date.now
        }
    }
    ]
});

const PostModel = mongoose.model('post', PostSchema);
module.exports = PostModel;