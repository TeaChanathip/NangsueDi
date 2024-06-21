import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { UsersModel } from './schemas/users.schema';
import { Model, Types } from 'mongoose';
import { UserPermissionsModel } from './schemas/user-permissions.schema';
import { User, UserResponse } from 'src/shared/interfaces/user.interface';
import { AuthRegisterPayload } from 'src/modules/auth/dtos/auth.register.dto';
import { UserEditPayload } from 'src/modules/users/dtos/user.edit.dto';
import { UserChangePasswordPayload } from 'src/modules/users/dtos/user.change-password.dto';

@Injectable()
export class UsersCollectionService {
    constructor(
        @InjectModel(UsersModel.name)
        private readonly usersModel: Model<UsersModel>,
        @InjectModel(UserPermissionsModel.name)
        private readonly userPermissionsModel: Model<UserPermissionsModel>,
    ) {}

    async findById(userId: Types.ObjectId): Promise<User> {
        return await this.usersModel.findById(userId);
    }

    async findByEmail(email: string): Promise<User> {
        return await this.usersModel.findOne({ email });
    }

    async saveNewUser(payload: AuthRegisterPayload): Promise<UserResponse> {
        const newUser = new this.usersModel(payload);
        return this.cvt2Response(await newUser.save());
    }

    async editUser(
        userId: Types.ObjectId,
        payload: UserEditPayload,
    ): Promise<UserResponse> {
        return this.cvt2Response(
            await this.usersModel.findByIdAndUpdate(userId, payload, {
                new: true,
            }),
        );
    }

    async deleteUser(userId: Types.ObjectId): Promise<UserResponse> {
        return this.cvt2Response(
            await this.usersModel.findByIdAndDelete(userId),
        );
    }

    async changePassword(
        userId: Types.ObjectId,
        payload: UserChangePasswordPayload,
    ): Promise<UserResponse> {
        return this.cvt2Response(
            await this.usersModel.findByIdAndUpdate(userId, payload, {
                new: true,
            }),
        );
    }

    private cvt2Response(user: User): UserResponse | null {
        if (!user) {
            return null;
        }

        return {
            email: user.email,
            phone: user.phone,
            firstName: user.firstName,
            lastName: user.lastName,
            avartarUrl: user.avartarUrl,
            role: user.role,
        };
    }
}
