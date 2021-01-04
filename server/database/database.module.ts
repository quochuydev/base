import mongoose from 'mongoose';
import { Module, Global } from '@nestjs/common';
import { MONGODB } from '@blog/server/configs/index.config';
import { isTestMode } from '@blog/server/configs/index.config';

const DB_CONNECTION_TOKEN = Symbol('DB_CONNECTION_TOKEN');

const Connection = {
    provide: DB_CONNECTION_TOKEN,
    useFactory: () => {
        const RECONNET_INTERVAL = 500;

        if (!isTestMode) {
            mongoose.connection.on('connecting', () => {
                console.log('connecting...');
            });

            mongoose.connection.on('open', () => {
                console.info('open');
            });

            mongoose.connection.on('disconnected', () => {
                console.error(`disconnected ${RECONNET_INTERVAL / 1000}s`);
            });

            mongoose.connection.on('error', (error) => {
                console.error('error', error);
                mongoose.disconnect();
                process.exit(99);
            });
        }

        return mongoose.connect(MONGODB.uri, {
            useCreateIndex: true,
            useNewUrlParser: true,
            useFindAndModify: false,
            useUnifiedTopology: true,
        });
    },
};

@Global()
@Module({
    providers: [Connection],
})
export class DatabaseModule {}
