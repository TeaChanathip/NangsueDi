import { Logger, Module, OnApplicationShutdown } from '@nestjs/common';
import { MongodbService } from './mongodb.service';
import { InjectConnection, MongooseModule } from '@nestjs/mongoose';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { Connection } from 'mongoose';
import { UsersCollectionModule } from './users-collection/users-collection.module';

@Module({
    imports: [
        MongooseModule.forRootAsync({
            imports: [ConfigModule],
            inject: [ConfigService],
            useFactory: async (configService: ConfigService) => {
                const uri = configService.get<string>('MONGODB_URI');
                return {
                    uri,
                    connectionFactory: (connection: Connection) => {
                        const logger = new Logger('database');
                        if (connection.readyState === 1) {
                            logger.log('Connected to MongoDB');
                        }

                        connection.on('disconnected', () => {
                            logger.log('Disconnected from MongoDB');
                        });
                        return connection;
                    },
                };
            },
        }),
        UsersCollectionModule,
    ],
    providers: [MongodbService],
    exports: [MongodbService],
})
export class MongodbModule implements OnApplicationShutdown {
    constructor(@InjectConnection() private readonly connection: Connection) {}
    async onApplicationShutdown() {
        if (this.connection) {
            await this.connection.close();
        }
    }
}
