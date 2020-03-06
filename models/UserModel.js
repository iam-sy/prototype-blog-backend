import mongoose from 'mongoose';
import crypto from 'crypto';
const { PASSWORD_HASH_KEY: secret } = process.env;

function hash(password) {
    return crypto
        .createHmac('sha256', secret)
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
    const user = new this({
        displayName,
        email,
        password: hash(password),
    });
    return user.save();
};

//postSchema.index({ Users: 1, title: 1 }, { unique: true });
//postSchema.index({ title: 1 }, { unique: true });
const userModel = mongoose.model('user', userSchema);

export default userModel;
