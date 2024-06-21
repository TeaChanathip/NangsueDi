import {
    HttpException,
    HttpStatus,
    Injectable,
    NotFoundException,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { UsersCollectionService } from 'src/common/mongodb/users-collection/users-collection.service';
import { UserEditDto, UserEditPayload } from './dtos/user.edit.dto';
import { getCurrentUnix } from 'src/shared/utils/getCurrentUnix';
import { Types } from 'mongoose';
import {
    UserChangePasswordDto,
    UserChangePasswordPayload,
} from './dtos/user.change-password.dto';
import { User, UserResponse } from 'src/shared/interfaces/user.interface';

@Injectable()
export class UsersService {
    constructor(
        private readonly usersCollectionService: UsersCollectionService,
    ) {}

    async editProfile(
        userId: Types.ObjectId,
        userEditDto: UserEditDto,
    ): Promise<UserResponse> {
        if (!userId) {
            throw new NotFoundException();
        }

        const user = await this.usersCollectionService.findById(userId);
        if (!user) {
            throw new NotFoundException();
        }

        const payload: UserEditPayload = {
            ...userEditDto,
            updatedAt: getCurrentUnix(),
        };

        return await this.usersCollectionService.editUser(userId, payload);
    }

    async deleteProfile(
        userId: Types.ObjectId,
        password: string,
    ): Promise<UserResponse> {
        const user: User = await this.findByIdAndComparePassword(
            userId,
            password,
            'The password is incorrect',
        );

        return this.usersCollectionService.deleteUser(userId);
    }

    async changePassword(
        userId: Types.ObjectId,
        userChangePasswordDto: UserChangePasswordDto,
    ): Promise<UserResponse> {
        const user: User = await this.findByIdAndComparePassword(
            userId,
            userChangePasswordDto.password,
            'The old password is incorrect',
        );

        const salt = await bcrypt.genSalt();
        const hash = await bcrypt.hash(userChangePasswordDto.newPassword, salt);

        const payload: UserChangePasswordPayload = {
            password: hash,
            tokenVersion: getCurrentUnix(),
        };

        return this.usersCollectionService.changePassword(userId, payload);
    }

    private async findByIdAndComparePassword(
        userId: Types.ObjectId,
        password: string,
        errMsg: string,
    ): Promise<User> {
        const user = await this.usersCollectionService.findById(userId);
        if (!user) {
            throw new NotFoundException();
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            throw new HttpException(errMsg, HttpStatus.UNAUTHORIZED);
        }

        return user;
    }
}
