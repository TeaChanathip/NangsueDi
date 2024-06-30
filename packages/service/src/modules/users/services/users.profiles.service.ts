import {
    HttpException,
    HttpStatus,
    Injectable,
    InternalServerErrorException,
    NotFoundException,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { UsersCollService } from 'src/common/mongodb/usersdb/services/users.collection.service';
import { UserUpdateReqDto } from '../dtos/user.update.req.dto';
import { getCurrentUnix } from 'src/shared/utils/getCurrentUnix';
import { Types } from 'mongoose';
import { UsersChangePasswordReqDto } from '../dtos/users.change-password.req.dto';
import { UserFiltered } from 'src/shared/interfaces/user.filtered.res.interface';
import { PasswordUpdateDto } from 'src/common/mongodb/usersdb/dtos/password.update.dto';
import { UserUpdateDto } from 'src/common/mongodb/usersdb/dtos/user.update.dto';
import { UsersPermsCollService } from 'src/common/mongodb/usersdb/services/users-permissions.collection.service';
import { UsersAddrsCollService } from 'src/common/mongodb/usersdb/services/users-addresses.collection.service';
import { filterUserRes } from 'src/shared/utils/filterUserRes';
import { BorrowsCollService } from 'src/common/mongodb/borrowsdb/borrows.collection.service';

@Injectable()
export class UsersProfilesService {
    constructor(
        private readonly usersCollService: UsersCollService,
        private readonly usersPermsCollService: UsersPermsCollService,
        private readonly usersAddrsCollService: UsersAddrsCollService,
        private readonly borrowsCollService: BorrowsCollService,
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
        await this.comparePassword(
            userId,
            password,
            'The password is incorrect',
        );

        const user = await this.usersCollService.findById(userId);
        if (!user) {
            throw new InternalServerErrorException();
        }

        const borrow = await this.borrowsCollService.findByUserId(userId);
        if (borrow.length > 0) {
            throw new HttpException(
                'Cannot delete user with pending borrow requests',
                HttpStatus.BAD_REQUEST,
            );
        }

        const { permissions, addresses } = user;

        if (permissions) {
            const deletedPerms = await this.usersPermsCollService.deleteById(
                permissions._id,
            );
            if (!deletedPerms) {
                throw new InternalServerErrorException();
            }
        }

        if (addresses) {
            const deletedAddrs = await Promise.all(
                addresses.map(async ({ _id: addrId }) => {
                    return await this.usersAddrsCollService.removeById(addrId);
                }),
            );
            if (!deletedAddrs || deletedAddrs.includes(null)) {
                throw new InternalServerErrorException();
            }
        }

        const deletedUser = await this.usersCollService.delete(userId);
        if (!deletedUser) {
            throw new InternalServerErrorException();
        }

        return filterUserRes(deletedUser);
    }

    async changePassword(
        userId: Types.ObjectId,
        usersChangePasswordReqDto: UsersChangePasswordReqDto,
    ): Promise<UserFiltered> {
        await this.comparePassword(
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

    private async comparePassword(
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
}
