import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UsersCollectionService } from 'src/common/mongodb/users-collection/users-collection.service';
import { AuthRegisterDto, AuthRegisterPayload } from './dtos/auth.register.dto';
import { User } from 'src/shared/interfaces/user.interface';
import { getCurrentUnix } from 'src/shared/utils/getCurrentUnix';
import { Roles } from 'src/shared/enums/roles.enum';
import { JwtPayload } from 'src/shared/interfaces/jwt.payload.interface';

@Injectable()
export class AuthService {
    constructor(
        private usersCollectionService: UsersCollectionService,
        private jwtService: JwtService,
    ) {}

    async register(authRegisterDto: AuthRegisterDto): Promise<User> {
        const user = await this.usersCollectionService.findByEmail(
            authRegisterDto.email,
        );
        if (user) {
            throw new HttpException(
                'The email is already taken',
                HttpStatus.BAD_REQUEST,
            );
        }

        const salt = await bcrypt.genSalt();
        const hash = await bcrypt.hash(authRegisterDto.password, salt);

        const payload: AuthRegisterPayload = {
            ...authRegisterDto,
            password: hash,
            role: Roles.USER,
            registeredAt: getCurrentUnix(),
            tokenVersion: getCurrentUnix(),
        };

        return await this.usersCollectionService.saveNewUser(payload);
    }

    async login(email: string, password: string): Promise<any> {
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

        const payload: JwtPayload = {
            sub: user._id,
            email: user.email,
            role: user.role,
            tokenVersion: user.tokenVersion,
        };
        return {
            access_token: await this.jwtService.signAsync(payload),
        };
    }
}
