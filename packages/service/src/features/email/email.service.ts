import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';

@Injectable()
export class EmailService {
    constructor(private readonly mailService: MailerService) {}

    async sendResetUrl(email: string, resetToken: string) {
        const message = `Forgot your password? If you didn't forget your password, please ignore this email!\nHere's your token: ${resetToken}`;

        return await this.mailService.sendMail({
            from: 'Library Management System <lms@gmail.com>',
            to: email,
            subject: `LMS reset password`,
            text: message,
        });
    }
}
