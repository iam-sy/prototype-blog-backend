import mongoose from 'mongoose';

export const mongooseConnect = () => {
    const db = mongoose.connection;
    db.on('error', console.error.bind(console, 'MongoDB connection error:'));
    mongoose.set('useUnifiedTopology', true);
    mongoose.set('useNewUrlParser', true);
    mongoose.connect(
        'mongodb+srv://test:1234@moon-zpapa.mongodb.net/test?retryWrites=true&w=majority',
        {
            useNewUrlParser: true,
        },
    );
    mongoose.Promise = global.Promise;
};
