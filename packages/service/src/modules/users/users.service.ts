import {
    HttpException,
    HttpStatus,
    Injectable,
    NotFoundException,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { UsersCollectionService } from 'src/common/mongodb/users-collection/users-collection.service';
import { UserUpdateReqDto } from './dtos/user.update.req.dto';
import { getCurrentUnix } from 'src/shared/utils/getCurrentUnix';
import { Types } from 'mongoose';
import { UsersChangePasswordReqDto } from './dtos/users.change-password.req.dto';
import { UserFiltered } from 'src/shared/interfaces/user.filtered.res.interface';
import { PasswordUpdateDto } from 'src/common/mongodb/users-collection/dtos/password.update.dto';
import { UserUpdateDto } from 'src/common/mongodb/users-collection/dtos/user.update.dto';

@Injectable()
export class UsersService {
    constructor(
        private readonly usersCollectionService: UsersCollectionService,
    ) {}

    async updateProfile(
        userId: Types.ObjectId,
        userUpdateReqDto: UserUpdateReqDto,
    ): Promise<UserFiltered> {
        if (!userId) {
            throw new NotFoundException();
        }

        const user = await this.usersCollectionService.findById(userId);
        if (!user) {
            throw new NotFoundException();
        }

        const userUpdateDto: UserUpdateDto = {
            ...userUpdateReqDto,
            updatedAt: getCurrentUnix(),
        };

        return await this.usersCollectionService.editUser(
            userId,
            userUpdateDto,
        );
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

        return this.usersCollectionService.deleteUser(userId);
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

        return this.usersCollectionService.changePassword(
            userId,
            passwordUpdateDto,
        );
    }

    private async comparePassword(
        userId: Types.ObjectId,
        password: string,
        errMsg: string,
    ): Promise<void> {
        const user = await this.usersCollectionService.findById(userId);
        if (!user) {
            throw new NotFoundException();
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            throw new HttpException(errMsg, HttpStatus.UNAUTHORIZED);
        }
    }
}
