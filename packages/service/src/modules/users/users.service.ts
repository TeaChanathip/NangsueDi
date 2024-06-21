import {
    HttpException,
    HttpStatus,
    Injectable,
    NotFoundException,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { UsersCollectionService } from 'src/common/mongodb/users-collection/users-collection.service';
import { UserEditDto } from './dtos/user.edit.dto';
import { getCurrentUnix } from 'src/shared/utils/getCurrentUnix';
import { Types } from 'mongoose';

@Injectable()
export class UsersService {
    constructor(
        private readonly usersCollectionService: UsersCollectionService,
    ) {}

    async editProfile(userId: Types.ObjectId, userEditDto: UserEditDto) {
        if (!userId) {
            throw new NotFoundException();
        }

        const user = await this.usersCollectionService.findById(userId);
        if (!user) {
            throw new NotFoundException();
        }

        const payload = {
            ...userEditDto,
            updatedAt: getCurrentUnix(),
        };

        return await this.usersCollectionService.editUser(userId, payload);
    }

    async deleteProfile(userId: Types.ObjectId, password: string) {
        const user = await this.findByIdAndComparePassword(
            userId,
            password,
            'The password is incorrect',
        );

        return this.usersCollectionService.deleteUser(userId);
    }

    async changePassword(
        userId: Types.ObjectId,
        password: string,
        newPassword: string,
    ) {
        const user = await this.findByIdAndComparePassword(
            userId,
            password,
            'The old password is incorrect',
        );
    }

    private async findByIdAndComparePassword(
        userId: Types.ObjectId,
        password: string,
        errMsg: string,
    ) {
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
