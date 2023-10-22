import mongoose from 'mongoose';

let isConnected: boolean = false;

export const connectToDatabase = async () => {
    mongoose.set('strictQuery', true);
    debugger;
    if (!process.env.MONGODB_URL) {
        return console.log('missing mogo db url');
    }

    if (isConnected) {
        return console.log('MongoDb already connected');
    }

    try {
        await mongoose.connect(process.env.MONGODB_URL, {
            dbName: "nStackOverflow"
        });
        console.log('MongoDb is connected');
    }
    catch (e) {
        console.log('MongoDb connection failed', e);
    }

}