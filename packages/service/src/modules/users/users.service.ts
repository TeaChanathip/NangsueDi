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
import { UsersPermsCollService } from 'src/common/mongodb/usersdb/services/users-permissions.collection.service';
import { filterUserRes } from 'src/shared/utils/filterUserRes';
import { UserPermsRes } from 'src/common/mongodb/usersdb/interfaces/user-permissions.res.interface';

@Injectable()
export class UsersService {
    constructor(
        private readonly usersCollService: UsersCollService,
        private readonly usersPermsCollService: UsersPermsCollService,
    ) {}

    async getProfile(userId: Types.ObjectId): Promise<UserFiltered> {
        return await this.usersCollService.getWithPerms(userId);
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

        return this.usersCollService.getWithPerms(userId);
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

        const deletedUser = await this.usersCollService.delete(userId);
        if (!deletedUser) {
            throw new InternalServerErrorException();
        }

        let deletedPermission: UserPermsRes;
        if (deletedUser.permissions) {
            deletedPermission =
                await this.usersPermsCollService.deleteByUserId(userId);
        }

        return filterUserRes(deletedUser, deletedPermission);
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

        return await this.usersCollService.getWithPerms(userId);
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
