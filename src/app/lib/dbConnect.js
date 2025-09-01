import mongoose from 'mongoose';

const connection = {}

const dbConnect = async () => {
    if (connection.isConnected) {
        return;
    }

    const dbOptions = {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        autoIndex: false,
        /*reconnectTries: Number.MAX_VALUE,
        reconnectInterval: 500,*/
        maxPoolSize: 5,
        connectTimeoutMS: 10000,
        family: 4,
    };

    const db = await mongoose.connect(process.env.MONGODB_URI, dbOptions);
    mongoose.Promise = global.Promise;
    connection.isConnected = db.connections[0].readyState;

    mongoose.set('strictQuery', true);

    mongoose.connection.on('connected', () => {
        console.log('Mongoose has successfully connected!');
    });

    mongoose.connection.on('err', err => {
        console.error(`Mongoose connection error: \n${err.stack}`);
    });

    mongoose.connection.on('disconnected', () => {
        console.warn('Mongoose connection lost');
    });
};

export default dbConnect;