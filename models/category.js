const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const CategorySchema = new Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    bannerImage: {
        type: String
    }

});

const CategoryModel = mongoose.model('category', CategorySchema);
module.exports = CategoryModel;