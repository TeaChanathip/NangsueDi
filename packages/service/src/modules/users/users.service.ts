import {
    HttpException,
    HttpStatus,
    Injectable,
    InternalServerErrorException,
    NotFoundException,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { UsersCollService } from 'src/common/mongodb/usersdb/services/users.collection.service';
import { UserUpdateReqDto } from './dtos/user.update.req.dto';
import { getCurrentUnix } from 'src/shared/utils/getCurrentUnix';
import { Types } from 'mongoose';
import { UsersChangePasswordReqDto } from './dtos/users.change-password.req.dto';
import { UserFiltered } from 'src/shared/interfaces/user.filtered.res.interface';
import { PasswordUpdateDto } from 'src/common/mongodb/usersdb/dtos/password.update.dto';
import { UserUpdateDto } from 'src/common/mongodb/usersdb/dtos/user.update.dto';
import { UserAddrsRes } from 'src/common/mongodb/usersdb/interfaces/user-addresses.res.interface';
import { UsersAddrsCollService } from 'src/common/mongodb/usersdb/services/users-addresses.collection/users-addresses.collection.service';
import { UserAddrDto } from './dtos/user.address.dto';
import { UserAddrUpdateReqDto } from './dtos/user-address.update.req.dto';
import { cvtToObjectId } from 'src/shared/utils/cvtToObjectId';

@Injectable()
export class UsersService {
    constructor(
        private readonly usersCollService: UsersCollService,
        private readonly usersAddrsCollService: UsersAddrsCollService,
    ) {}

    async getProfile(userId: Types.ObjectId): Promise<UserFiltered> {
        return await this.usersCollService.getUserFiltered(userId);
    }

    async updateProfile(
        userId: Types.ObjectId,
        userUpdateReqDto: UserUpdateReqDto,
    ): Promise<UserFiltered> {
        if (!userId) {
            throw new NotFoundException();
        }

        const user = await this.usersCollService.findById(userId);
        if (!user) {
            throw new NotFoundException();
        }

        const userUpdateDto: UserUpdateDto = {
            ...userUpdateReqDto,
            updatedAt: getCurrentUnix(),
        };

        const updatedUser = await this.usersCollService.updateProfile(
            userId,
            userUpdateDto,
        );
        if (!updatedUser) {
            throw new InternalServerErrorException();
        }

        return this.usersCollService.getUserFiltered(userId);
    }

    async deleteProfile(
        userId: Types.ObjectId,
        password: string,
    ): Promise<UserFiltered> {
        await comparePassword(userId, password, 'The password is incorrect');

        const user = await this.usersCollService.getUserFiltered(userId);
        if (!user) {
            throw new InternalServerErrorException();
        }

        const deletedUser = await this.usersCollService.delete(userId);
        if (!deletedUser) {
            throw new InternalServerErrorException();
        }

        return user;
    }

    async changePassword(
        userId: Types.ObjectId,
        usersChangePasswordReqDto: UsersChangePasswordReqDto,
    ): Promise<UserFiltered> {
        await comparePassword(
            userId,
            usersChangePasswordReqDto.password,
            'The old password is incorrect',
        );

        const salt = await bcrypt.genSalt();
        const hash = await bcrypt.hash(
            usersChangePasswordReqDto.newPassword,
            salt,
        );

        const passwordUpdateDto: PasswordUpdateDto = {
            password: hash,
            tokenVersion: getCurrentUnix(),
        };

        const updatedUser = await this.usersCollService.updatePassword(
            userId,
            passwordUpdateDto,
        );
        if (!updatedUser) {
            throw new InternalServerErrorException();
        }

        return await this.usersCollService.getUserFiltered(userId);
    }

    async getAddresses(userId: Types.ObjectId): Promise<UserAddrsRes[]> {
        const addrs = await this.usersCollService.getAddresses(userId);
        if (!addrs) {
            throw new InternalServerErrorException();
        }

        return addrs;
    }

    async addAddress(
        userId: Types.ObjectId,
        userAddrDto: UserAddrDto,
    ): Promise<UserAddrsRes> {
        const user = await this.usersCollService.findById(userId);
        if (user.addresses.length >= 5) {
            throw new HttpException(
                'The user can have at most 5 addresses',
                HttpStatus.BAD_REQUEST,
            );
        }

        const addr = await this.usersAddrsCollService.saveNew(userAddrDto);
        if (!addr) {
            throw new InternalServerErrorException();
        }

        const newUser = await this.usersCollService.addAddress(
            userId,
            addr._id,
        );
        if (!newUser) {
            throw new InternalServerErrorException();
        }

        return addr;
    }

    async updateAddress(
        userId: Types.ObjectId,
        addrId: string,
        userAddrUpdateReqDto: UserAddrUpdateReqDto,
    ): Promise<UserAddrsRes> {
        const addrObjId = cvtToObjectId(addrId, 'addrId');

        const user = await this.usersCollService.findById(userId);
        if (!user) {
            throw new InternalServerErrorException();
        }
        if (!user.addresses.find((id) => String(id) === String(addrObjId))) {
            throw new HttpException(
                'The user does not own this address',
                HttpStatus.BAD_REQUEST,
            );
        }

        return this.usersAddrsCollService.updateById(
            addrObjId,
            userAddrUpdateReqDto,
        );
    }

    async removeAddress(userId: Types.ObjectId, addrId: string) {
        const addrObjId = cvtToObjectId(addrId, 'addrId');

        const user = await this.usersCollService.findById(userId);
        if (!user) {
            throw new InternalServerErrorException();
        }
        if (!user.addresses.find((id) => String(id) === String(addrObjId))) {
            throw new HttpException(
                'The user does not own this address',
                HttpStatus.BAD_REQUEST,
            );
        }

        const deletedAddr =
            await this.usersAddrsCollService.removeById(addrObjId);
        if (!deletedAddr) {
            throw new InternalServerErrorException();
        }

        const newUser = await this.usersCollService.removeAddress(
            userId,
            deletedAddr._id,
        );
        if (!newUser) {
            throw new InternalServerErrorException();
        }

        return deletedAddr;
    }
}

async function comparePassword(
    userId: Types.ObjectId,
    password: string,
    errMsg: string,
): Promise<void> {
    const user = await this.usersCollService.findById(userId);
    if (!user) {
        throw new NotFoundException();
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
        throw new HttpException(errMsg, HttpStatus.UNAUTHORIZED);
    }
}
