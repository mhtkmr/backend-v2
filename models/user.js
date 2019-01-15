const mongo = require("mongoose");
const crypto = require('crypto');
const {
    validateEmail,
    validateUsername
} = require("./../validator");
const Schema = mongo.Schema;

const userSchema = new Schema({
    username: {
        type: String,
        trim: true,
        lowercase: true,
        unique: true,
        required: 'Username is required',
        validate: [validateUsername, 'Invalid username'],
        // match: [validateUsername, 'Invalid username'],
        index: true
    },
    email: {
        type: String,
        trim: true,
        lowercase: true,
        unique: true,
        required: 'Email address is required',
        validate: [validateEmail, 'Invalid email address'],
        // match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Invalid email address'],
        index: true
    },
    password: {
        type: String,
        required: 'Password is required',
        validate: [validatePassword, 'Invalid password'],
        // match: [/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,10}$/, 'Invalid password']
    },
    hash: String,
    salt: String, // ## TODO: move to .env
    image: String,
    bio: String,
}, {
    timestamps: true
});

UserSchema.methods.setPassword = (password) => {
    this.salt = crypto.randomBytes(16).toString('hex');
    this.hash = crypto.pbkdf2Sync(password, this.salt, 10000, 512, 'sha512').toString('hex');
};

UserSchema.methods.validPassword = (password) => {
    const hash = crypto.pbkdf2Sync(password, this.salt, 10000, 512, 'sha512').toString('hex');
    return this.hash === hash;
};

mongo.model('User', userSchema);