import { Logger, Module, OnApplicationShutdown } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { SwaggerModule } from '@nestjs/swagger';
import { AuthModule } from './modules/auth/auth.module';
import { AuthGuard } from './common/guards/auth.guard';
import { APP_GUARD } from '@nestjs/core';
import { UsersModule } from './modules/users/users.module';
import { InjectConnection, MongooseModule } from '@nestjs/mongoose';
import { Connection } from 'mongoose';
import { UsersDBModule } from './common/mongodb/usersdb/users.db.module';
import { AdminsModule } from './modules/admins/admins.module';
import { RolesGuard } from './common/guards/roles.guard';
import { BooksDBModule } from './common/mongodb/booksdb/booksdb.module';
import { BooksModule } from './modules/books/books.module';

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
        UsersDBModule,
        BooksDBModule,
        AuthModule,
        UsersModule,
        AdminsModule,
        BooksModule,
    ],
    providers: [
        {
            provide: APP_GUARD,
            useClass: AuthGuard,
        },
        {
            provide: APP_GUARD,
            useClass: RolesGuard,
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
