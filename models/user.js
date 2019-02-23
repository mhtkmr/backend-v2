const mongo = require("mongoose");
const crypto = require('crypto');
const {
    validateEmail,
    validateUsername
} = require("./../validator");
const Schema = mongo.Schema;
mongo.set('useCreateIndex', true);

const userSchema = new Schema({
    username: {
        type: String,
        trim: true,
        lowercase: true,
        unique: true,
        required: 'Username is required',
        validate: [validateUsername, 'Invalid username'],
        // match: [validateUsername, 'Invalid username'],
        // index: true
    },
    email: {
        type: String,
        trim: true,
        lowercase: true,
        unique: true,
        required: 'Email address is required',
        validate: [validateEmail, 'Invalid email address'],
        // match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Invalid email address'],
        // index: true
    },
    // password: {
    //     type: String,
    //     required: 'Password is required',
    //    // validate: [validatePassword, 'Invalid password'],
    //     // match: [/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,10}$/, 'Invalid password']
    // },
    subscription: [{
        type: Schema.Types.ObjectId,
        ref: 'category'
    }],
    fullname:{
        firstname:{
            type: String,
            required: true
        },
        middlename:{
            type: String,
        },
        lastname:{
            type: String,
            required: true
        }
    },
    hash: {
        type: String,
        required: true
    },
    salt: String, // ## TODO: move to .env
    image: String,
    bio: String,
}, {
    timestamps: true
});

userSchema.methods.setPassword = function(password){
    this.salt = crypto.randomBytes(16).toString('hex');
    this.hash = crypto.pbkdf2Sync(password, this.salt, 10000, 512, 'sha512').toString('hex');
};

userSchema.methods.validPassword = function(password) {
    const hash = crypto.pbkdf2Sync(password, this.salt, 10000, 512, 'sha512').toString('hex');
    return this.hash === hash;
};

const UserModel = mongo.model('User', userSchema);
module.exports = UserModel;