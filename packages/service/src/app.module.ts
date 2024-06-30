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
import { BorrowsDBModule } from './common/mongodb/borrowsdb/borrowsdb.module';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { PermsGuard } from './common/guards/permissions.guard';
import { ReturnsdbModule } from './common/mongodb/returnsdb/returnsdb.module';
import { ActionsModule } from './modules/actions/actions.module';

@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true,
            envFilePath: '.env',
        }),
        ThrottlerModule.forRoot([
            {
                ttl: 1000,
                limit: 4,
            },
        ]),
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
        BorrowsDBModule,
        AuthModule,
        UsersModule,
        AdminsModule,
        BooksModule,
        ReturnsdbModule,
        ActionsModule,
    ],
    providers: [
        {
            provide: APP_GUARD,
            useClass: ThrottlerGuard,
        },
        {
            provide: APP_GUARD,
            useClass: AuthGuard,
        },
        {
            provide: APP_GUARD,
            useClass: RolesGuard,
        },
        {
            provide: APP_GUARD,
            useClass: PermsGuard,
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
