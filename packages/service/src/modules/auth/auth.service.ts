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
import { UsersAddrsCollService } from 'src/common/mongodb/usersdb/services/users-addresses.collection/users-addresses.collection.service';
import { UserAddrDto } from '../users/dtos/user.address.dto';
import { Types } from 'mongoose';

@Injectable()
export class AuthService {
    constructor(
        private readonly usersCollService: UsersCollService,
        private readonly usersAddrsCollService: UsersAddrsCollService,
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

        const addrs: UserAddrDto[] = authRegisterReqDto.addresses;
        delete authRegisterReqDto.addresses;

        let savedAddrIds: Types.ObjectId[];
        try {
            const savedAddrs = await Promise.all(
                addrs.map((addr) => this.usersAddrsCollService.saveNew(addr)),
            );

            // Filter out any falsy values (e.g., null, undefined) from the results
            const validSavedAddrs = savedAddrs.filter((savedAddr) => savedAddr);

            // Check if the number of valid saved addresses matches the number of input addresses
            if (validSavedAddrs.length !== addrs.length) {
                throw new InternalServerErrorException(
                    'Some addresses could not be saved.',
                );
            }

            // Extract _id from valid saved addresses
            savedAddrIds = validSavedAddrs.map((savedAddr) => savedAddr._id);
        } catch (error) {
            throw new InternalServerErrorException(error);
        }

        const userSaveDto: UserSaveDto = {
            ...authRegisterReqDto,
            addresses: savedAddrIds,
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
        return {
            accessToken: await this.jwtService.signAsync(userPayload),
            user: await this.usersCollService.getUserFiltered(user._id),
        };
    }
}
