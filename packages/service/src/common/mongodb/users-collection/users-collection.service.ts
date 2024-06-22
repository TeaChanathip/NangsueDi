import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { UsersModel } from './schemas/users.schema';
import { Model, Types } from 'mongoose';
import { UsersPermissionsModel } from './schemas/users-permissions.schema';
import { UserRes } from './interfaces/user.res.interface';
import { UserFiltered } from 'src/shared/interfaces/user.filtered.res.interface';
import { UserSaveDto } from './dtos/user.save.dto';
import { UserUpdateDto } from './dtos/user.update.dto';
import { PasswordUpdateDto } from './dtos/password.update.dto';
import { UserPermissionsSaveDto } from './dtos/user-permissions.save.dto';
import { UserPermissionsRes } from './interfaces/user-permissions.res.interface';

@Injectable()
export class UsersCollectionService {
    constructor(
        @InjectModel(UsersModel.name)
        private readonly usersModel: Model<UsersModel>,
        @InjectModel(UsersPermissionsModel.name)
        private readonly userPermissionsModel: Model<UsersPermissionsModel>,
    ) {}

    async findById(userId: Types.ObjectId): Promise<UserRes> {
        return await this.usersModel.findById(userId);
    }

    async findByEmail(email: string): Promise<UserRes> {
        return await this.usersModel.findOne({ email });
    }

    async getUser(userId: Types.ObjectId): Promise<UserFiltered> {
        const user = await this.usersModel.findById(userId);
        return await this.filterUser(user);
    }

    async saveNewUser(userSaveDto: UserSaveDto): Promise<UserFiltered> {
        const newUser = new this.usersModel(userSaveDto);
        const user = await newUser.save();

        return await this.filterUser(user);
    }

    async editUser(
        userId: Types.ObjectId,
        userUpdateDto: UserUpdateDto,
    ): Promise<UserFiltered> {
        const user = await this.usersModel.findByIdAndUpdate(
            userId,
            userUpdateDto,
            {
                new: true,
            },
        );

        return await this.filterUser(user);
    }

    async deleteUser(userId: Types.ObjectId): Promise<UserFiltered> {
        const user = await this.usersModel.findByIdAndDelete(userId);

        return await this.filterUser(user);
    }

    async changePassword(
        userId: Types.ObjectId,
        passwordUpdateDto: PasswordUpdateDto,
    ): Promise<UserFiltered> {
        const user = await this.usersModel.findByIdAndUpdate(
            userId,
            passwordUpdateDto,
            {
                new: true,
            },
        );

        return await this.filterUser(user);
    }

    async saveNewPermissions(
        userPermissionsSaveDto: UserPermissionsSaveDto,
    ): Promise<UserPermissionsRes> {
        const userPermissions = new this.userPermissionsModel(
            userPermissionsSaveDto,
        );

        return await userPermissions.save();
    }

    async addPermissionsToUser(
        userId: Types.ObjectId,
        permissions: Types.ObjectId,
    ): Promise<UserFiltered> {
        const user = await this.usersModel.findByIdAndUpdate(
            userId,
            {
                permissions: permissions,
            },
            { new: true },
        );

        return await this.filterUser(user);
    }

    private async filterUser(user: UserRes | null): Promise<UserFiltered> {
        if (!user) {
            return null;
        }

        const res: UserFiltered = {
            _id: user._id,
            email: user.email,
            phone: user.phone,
            firstName: user.firstName,
            lastName: user.lastName,
            avartarUrl: user.avartarUrl,
            role: user.role,
        };

        const permissions = await this.userPermissionsModel.findById(
            user.permissions,
        );

        // If user has no permissions or permissions not found
        if (!user.permissions || !permissions) {
            return res;
        }

        return {
            ...res,
            permissions: {
                canBorrow: permissions.canBorrow,
                canReview: permissions.canReview,
            },
        };
    }
}
