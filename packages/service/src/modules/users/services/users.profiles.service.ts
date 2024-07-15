import {
    HttpException,
    HttpStatus,
    Injectable,
    InternalServerErrorException,
    NotFoundException,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { UsersCollService } from '../../../common/mongodb/usersdb/services/users.collection.service';
import { UserUpdateReqDto } from '../dtos/user.update.req.dto';
import { getCurrentUnix } from '../../../shared/utils/getCurrentUnix';
import { Connection, Types } from 'mongoose';
import { UsersChangePasswordReqDto } from '../dtos/users.change-password.req.dto';
import { UserFiltered } from '../../../shared/interfaces/user.filtered.res.interface';
import { PasswordUpdateDto } from '../../../common/mongodb/usersdb/dtos/password.update.dto';
import { UserUpdateDto } from '../../../common/mongodb/usersdb/dtos/user.update.dto';
import { UsersPermsCollService } from '../../../common/mongodb/usersdb/services/users-permissions.collection.service';
import { UsersAddrsCollService } from '../../../common/mongodb/usersdb/services/users-addresses.collection.service';
import { filterUserRes } from '../../../shared/utils/filterUserRes';
import { BorrowsCollService } from '../../../common/mongodb/borrowsdb/borrows.collection.service';
import { InjectConnection } from '@nestjs/mongoose';
import { transaction } from '../../../shared/utils/mongo.transaction';

@Injectable()
export class UsersProfilesService {
    constructor(
        @InjectConnection() private readonly connection: Connection,
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

        return transaction(this.connection, async (session) => {
            if (permissions) {
                const deletedPerms =
                    await this.usersPermsCollService.deleteById(
                        permissions._id,
                        session,
                    );
                if (!deletedPerms) {
                    throw new InternalServerErrorException();
                }
            }

            if (addresses) {
                const deletedAddrs = await Promise.all(
                    addresses.map(async ({ _id: addrId }) => {
                        return await this.usersAddrsCollService.deleteById(
                            addrId,
                            session,
                        );
                    }),
                );
                if (!deletedAddrs || deletedAddrs.includes(null)) {
                    throw new InternalServerErrorException();
                }
            }

            const deletedUser = await this.usersCollService.delete(
                userId,
                session,
            );
            if (!deletedUser) {
                throw new InternalServerErrorException();
            }

            return filterUserRes(deletedUser);
        });
    }

    async changePassword(
        userId: Types.ObjectId,
        usersChangePasswordReqDto: UsersChangePasswordReqDto,
    ) {
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

        return {
            message: 'Password changed successfully',
        };
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
