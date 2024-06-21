import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { UsersModel } from './schemas/users.schema';
import { Model, Types } from 'mongoose';
import { UserPermissionsModel } from './schemas/user-permissions.schema';
import { User } from 'src/shared/interfaces/user.interface';
import { AuthRegisterPayload } from 'src/modules/auth/dtos/auth.register.dto';
import { UserEditPayload } from 'src/modules/users/dtos/user.edit.dto';

@Injectable()
export class UsersCollectionService {
    constructor(
        @InjectModel(UsersModel.name)
        private readonly usersModel: Model<UsersModel>,
        @InjectModel(UserPermissionsModel.name)
        private readonly userPermissionsModel: Model<UserPermissionsModel>,
    ) {}

    findById(userId: Types.ObjectId): Promise<User> {
        return this.usersModel.findById(userId);
    }

    findByEmail(email: string): Promise<User> {
        return this.usersModel.findOne({ email });
    }

    saveNewUser(payload: AuthRegisterPayload): Promise<User> {
        const newUser = new this.usersModel(payload);
        return newUser.save();
    }

    editUser(userId: Types.ObjectId, payload: UserEditPayload): Promise<User> {
        return this.usersModel.findByIdAndUpdate(userId, payload, {
            new: true,
        });
    }

    deleteUser(userId: Types.ObjectId): Promise<User> {
        return this.usersModel.findByIdAndDelete(userId);
    }
}
