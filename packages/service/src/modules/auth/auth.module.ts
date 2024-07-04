import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { UsersDBModule } from '../../common/mongodb/usersdb/users.db.module';
import { EmailModule } from '../../features/email/email.module';

@Module({
    imports: [
        JwtModule.registerAsync({
            imports: [ConfigModule],
            inject: [ConfigService],
            useFactory: async (configService: ConfigService) => ({
                global: true,
                secret: configService.get<string>('JWT_SECRET'),
                signOptions: { expiresIn: '30d' },
            }),
        }),
        UsersDBModule,
        EmailModule,
    ],
    providers: [AuthService],
    controllers: [AuthController],
    exports: [JwtModule],
})
export class AuthModule {}
