import { Logger, Module, OnApplicationShutdown } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { SwaggerModule } from '@nestjs/swagger';
import { AuthModule } from './modules/auth/auth.module';
import { AuthGuard } from './modules/auth/auth.guard';
import { APP_GUARD } from '@nestjs/core';
import { UsersModule } from './modules/users/users.module';
import { InjectConnection, MongooseModule } from '@nestjs/mongoose';
import { Connection } from 'mongoose';
import { UsersCollectionModule } from './common/mongodb/users-collection/users-collection.module';
import { AdminsModule } from './modules/admins/admins.module';

@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true,
            envFilePath: '.env',
        }),
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
        SwaggerModule,
        AuthModule,
        UsersModule,
        UsersCollectionModule,
        AdminsModule,
    ],
    providers: [
        {
            provide: APP_GUARD,
            useClass: AuthGuard,
        },
    ],
})
export class AppModule implements OnApplicationShutdown {
    constructor(@InjectConnection() private readonly connection: Connection) {}
    async onApplicationShutdown() {
        if (this.connection) {
            await this.connection.close();
        }
    }
}
