import {
    HttpException,
    HttpStatus,
    Injectable,
    InternalServerErrorException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UsersCollService } from 'src/common/mongodb/usersdb/services/users.collection.service';
import { AuthRegisterReqDto } from './dtos/auth.register.req.dto';
import { UserFiltered } from 'src/shared/interfaces/user.filtered.res.interface';
import { getCurrentUnix } from 'src/shared/utils/getCurrentUnix';
import { Role } from 'src/shared/enums/role.enum';
import { JwtUserPayload } from 'src/shared/interfaces/jwt-user.payload.interface';
import { UserSaveDto } from 'src/common/mongodb/usersdb/dtos/user.save.dto';
import { AuthLoginReqDto } from './dtos/auth.login.req.dto';
import { UserLoginRes } from './interfaces/user-login.res.interface';

@Injectable()
export class AuthService {
    constructor(
        private readonly usersCollService: UsersCollService,
        private readonly jwtService: JwtService,
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
}
