import mongoose from 'mongoose';
import crypto from 'crypto';
import { createToken } from '../../lib/token/token';

function hash(password) {
    return crypto
        .createHmac('sha256', process.env.PASSWORD_HASH_KEY)
        .update(password)
        .digest('hex');
}

const userSchema = new mongoose.Schema({
    displayName: String,
    email: String,
    social: {
        google: {
            id: String,
            accessToken: String,
        },
    },
    password: String,
    createdBy: {
        type: Date,
        default: Date.now(),
    },
    metaInfo: {
        activated: { type: Boolean, default: false },
    },
});

userSchema.statics.findByEmail = function(email) {
    return this.findOne({ email }).exec();
};

userSchema.statics.findByDisplayName = function(displayName) {
    return this.findOne({ displayName }).exec();
};

userSchema.statics.findExistancy = function({ email, displayName }) {
    return this.findOne({ $or: [{ email }, { displayName }] }).exec();
};

userSchema.statics.localRegister = function({ displayName, email, password }) {
    console.log('localRegister');
    const user = new this({
        displayName,
        email,
        password: hash(password),
    });
    console.log(user);
    return user.save();
};

userSchema.methods.validatePassword = function(password) {
    const hashed = hash(password);
    return this.password === hashed;
};

userSchema.methods.generateToken = function() {
    const { _id, displayName } = this;
    return createToken(
        {
            user: {
                _id,
                displayName,
            },
        },
        'user',
    );
};

//postSchema.index({ Users: 1, title: 1 }, { unique: true });
//postSchema.index({ title: 1 }, { unique: true });
const userModel = mongoose.model('user', userSchema);

export default userModel;
