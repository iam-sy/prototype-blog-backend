import mongoose from 'mongoose';
const { MONGOOSE_LOCAL_URL: connact } = process.env;
export const mongooseConnect = () => {
    const db = mongoose.connection;
    db.on('error', console.error.bind(console, 'MongoDB connection error:'));
    mongoose.set('useUnifiedTopology', true);
    mongoose.set('useNewUrlParser', true);
    /*mongoose.connect(connact, {
        useNewUrlParser: true,
    });*/

    mongoose.connect(connact, {
        useNewUrlParser: true,
    });
    mongoose.Promise = global.Promise;
};
