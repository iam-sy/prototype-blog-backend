import mongoose from 'mongoose';

export const mongooseConnect = () => {
    const db = mongoose.connection;
    db.on('error', console.error.bind(console, 'MongoDB connection error:'));
    mongoose.set('useUnifiedTopology', true);
    mongoose.set('useNewUrlParser', true);
    /*mongoose.connect(connact, {
        useNewUrlParser: true,
    });*/
    mongoose.connect(process.env.MONGODB_URI, {
        useNewUrlParser: true,
    });
    mongoose.Promise = global.Promise;
};
