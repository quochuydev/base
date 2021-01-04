import { MONGODB } from '../server/configs/index.config';
import mongoose from 'mongoose';

const init = async () => {
    const conn = await mongoose.connect(MONGODB.uri, {
        useCreateIndex: true,
        useNewUrlParser: true,
        useFindAndModify: false,
        useUnifiedTopology: true,
    });

    await Promise.all([]);

    conn.connection.close();

    process.exit(0);
};

init();
