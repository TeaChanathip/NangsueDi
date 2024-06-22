import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UsersCollectionService } from 'src/common/mongodb/users-collection/users-collection.service';
import { AuthRegisterReqDto } from './dtos/auth.register.req.dto';
import { UserFiltered } from 'src/shared/interfaces/user.filtered.res.interface';
import { getCurrentUnix } from 'src/shared/utils/getCurrentUnix';
import { Role } from 'src/shared/enums/role.enum';
import { JwtUserPayload } from 'src/shared/interfaces/jwt-user.payload.interface';
import { UserSaveDto } from 'src/common/mongodb/users-collection/dtos/user.save.dto';
import { AuthLoginReqDto } from './dtos/auth.login.req.dto';

@Injectable()
export class AuthService {
    constructor(
        private usersCollectionService: UsersCollectionService,
        private jwtService: JwtService,
    ) {}

    async register(
        authRegisterReqDto: AuthRegisterReqDto,
    ): Promise<UserFiltered> {
        const user = await this.usersCollectionService.findByEmail(
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

        return await this.usersCollectionService.saveNewUser(userSaveDto);
    }

    async login(
        authLoginReqDto: AuthLoginReqDto,
    ): Promise<{ access_token: string }> {
        const { email, password } = authLoginReqDto;
        const user = await this.usersCollectionService.findByEmail(email);
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

        const userPayload: JwtUserPayload = {
            sub: user._id,
            email: user.email,
            role: user.role,
            tokenVersion: user.tokenVersion,
        };
        return {
            access_token: await this.jwtService.signAsync(userPayload),
        };
    }
}
