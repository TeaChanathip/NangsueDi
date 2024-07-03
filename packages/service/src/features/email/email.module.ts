import { MailerModule } from '@nestjs-modules/mailer';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { EmailService } from './email.service';

@Module({
    imports: [
        MailerModule.forRootAsync({
            imports: [ConfigModule],
            inject: [ConfigService],
            useFactory: async (configService: ConfigService) => ({
                transport: {
                    host: configService.get<string>('EMAIL_HOST'),
                    port: configService.get<string>('EMAIL_PORT'),
                    auth: {
                        user: configService.get<string>('EMAIL_USERNAME'),
                        pass: configService.get<string>('EMAIL_PASSWORD'),
                    },
                },
            }),
        }),
    ],
    providers: [EmailService],
    exports: [EmailService],
})
export class EmailModule {}
