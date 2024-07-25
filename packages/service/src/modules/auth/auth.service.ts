import {
    BadRequestException,
    ForbiddenException,
    HttpException,
    HttpStatus,
    Injectable,
    InternalServerErrorException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UsersCollService } from '../../common/mongodb/usersdb/services/users.collection.service';
import { AuthRegisterReqDto } from './dtos/auth.register.req.dto';
import { UserFiltered } from '../../shared/interfaces/user.filtered.res.interface';
import { getCurrentUnix } from '../../shared/utils/getCurrentUnix';
import { Role } from '../../shared/enums/role.enum';
import { JwtUserPayload } from '../../shared/interfaces/jwt-user.payload.interface';
import { UserSaveDto } from '../../common/mongodb/usersdb/dtos/user.save.dto';
import { AuthLoginReqDto } from './dtos/auth.login.req.dto';
import { UserLoginRes } from './interfaces/user-login.res.interface';
import { InjectConnection } from '@nestjs/mongoose';
import { Connection } from 'mongoose';
import { transaction } from '../../shared/utils/mongo.transaction';
import { JwtResetPassPayload } from './interfaces/jwt-reset-password.payload.interface';
import { isEmail } from 'class-validator';
import { AuthResetReqDto } from './dtos/auth.reset.req.dto';
import { PasswordUpdateDto } from '../../common/mongodb/usersdb/dtos/password.update.dto';
import { EmailService } from '../../features/email/email.service';

@Injectable()
export class AuthService {
    constructor(
        @InjectConnection() private readonly connection: Connection,
        private readonly usersCollService: UsersCollService,
        private readonly jwtService: JwtService,
        private readonly emailService: EmailService,
    ) {}

    async register(
        authRegisterReqDto: AuthRegisterReqDto,
    ): Promise<UserFiltered> {
        const user = await this.usersCollService.findByEmail(
            authRegisterReqDto.email,
        );
        if (user) {
            throw new HttpException(
                'The email is already taken',
                HttpStatus.BAD_REQUEST,
            );
        }

        const salt = await bcrypt.genSalt();
        const hash = await bcrypt.hash(authRegisterReqDto.password, salt);

        const userSaveDto: UserSaveDto = {
            ...authRegisterReqDto,
            password: hash,
            role: Role.USER,
            registeredAt: getCurrentUnix(),
            tokenVersion: getCurrentUnix(),
        };

        const savedUser = await this.usersCollService.saveNew(userSaveDto);
        if (!savedUser) {
            throw new InternalServerErrorException();
        }

        return await this.usersCollService.getUserFiltered(savedUser._id);
    }

    async login(authLoginReqDto: AuthLoginReqDto): Promise<UserLoginRes> {
        const { email, password } = authLoginReqDto;
        const user = await this.usersCollService.findByEmail(email);
        if (!user) {
            throw new HttpException(
                'The email or password is incorrect',
                HttpStatus.UNAUTHORIZED,
            );
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            throw new HttpException(
                'The email or password is incorrect',
                HttpStatus.UNAUTHORIZED,
            );
        }

        if (user.suspendedAt !== undefined) {
            throw new HttpException(
                'The user has been suspended',
                HttpStatus.FORBIDDEN,
            );
        }

        const userPayload: JwtUserPayload = {
            sub: user._id,
            email: user.email,
            role: user.role,
            tokenVersion: user.tokenVersion,
        };

        const accessToken = await this.jwtService.signAsync(userPayload);
        const filteredUser = await this.usersCollService.getUserFiltered(
            user._id,
        );

        if (!accessToken || !filteredUser) {
            throw new InternalServerErrorException();
        }

        return {
            accessToken,
            user: filteredUser,
        };
    }

    async forgotPassword(email: string) {
        if (!isEmail(email)) {
            throw new HttpException(
                'The email format is incorrect',
                HttpStatus.BAD_REQUEST,
            );
        }

        const user = await this.usersCollService.findByEmail(email);
        if (!user) {
            throw new HttpException(
                'The email is incorrect',
                HttpStatus.BAD_REQUEST,
            );
        }

        return transaction(this.connection, async (session) => {
            // Update forgotTokenVer in Users document
            const currentUnix = getCurrentUnix();
            const updatedUser = await this.usersCollService.updateFogotToken(
                user._id,
                currentUnix,
                session,
            );
            if (!updatedUser) {
                throw new InternalServerErrorException();
            }

            // Generate a reset token
            const resetPayload: JwtResetPassPayload = {
                userId: updatedUser._id,
                resetTokenVer: updatedUser.resetTokenVer,
            };
            const resetToken = await this.jwtService.signAsync(resetPayload, {
                expiresIn: '1d',
            });
            if (!resetToken) {
                throw new InternalServerErrorException();
            }

            // Sending reset-password url to user's email
            const sendedEmail = await this.emailService.sendResetUrl(
                email,
                `${process.env.CLIENT_URL}/reset-password/${resetToken}`,
            );
            if (!sendedEmail) {
                throw new InternalServerErrorException();
            }

            return {
                message: 'Sending reset-password URL to your email',
            };
        });
    }

    async resetPassword(authResetReqDto: AuthResetReqDto) {
        const { resetToken, newPassword } = authResetReqDto;

        let resetPayload: JwtResetPassPayload;
        try {
            resetPayload = await this.jwtService.verifyAsync(resetToken, {
                secret: process.env.JWT_SECRET,
            });
        } catch {
            throw new BadRequestException();
        }

        const { userId, resetTokenVer } = resetPayload;
        const user = await this.usersCollService.findById(userId);
        if (!user?.resetTokenVer) {
            throw new ForbiddenException();
        }
        if (user.resetTokenVer > resetTokenVer) {
            throw new HttpException(
                'The reset token version does not match',
                HttpStatus.FORBIDDEN,
            );
        }

        const salt = await bcrypt.genSalt();
        const hash = await bcrypt.hash(newPassword, salt);

        const passwordUpdateDto: PasswordUpdateDto = {
            password: hash,
            tokenVersion: getCurrentUnix(),
            $unset: { resetTokenVer: '' },
        };

        const updatedUser = await this.usersCollService.updatePassword(
            userId,
            passwordUpdateDto,
        );
        if (!updatedUser) {
            throw new InternalServerErrorException();
        }

        return {
            message: 'Password reset successfully',
        };
    }
}
