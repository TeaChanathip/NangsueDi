import { Injectable } from '@nestjs/common';
import { UsersPermissionsModel } from '../schemas/users-permissions.schema';
import { Model, Types } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { UserPermsRes } from '../interfaces/user-permissions.res.interface';
import { UserPermsUpdateDto } from '../dtos/user-permissions.update.dto';
import { UserPermsSaveDto } from '../dtos/user-permissions.save.dto';

@Injectable()
export class UsersPermsCollService {
    constructor(
        @InjectModel(UsersPermissionsModel.name)
        private readonly userPermsModel: Model<UsersPermissionsModel>,
    ) {}

    async findByUserId(userId: Types.ObjectId): Promise<UserPermsRes> {
        return await this.userPermsModel.findOne({ userId });
    }

    async saveNew(userPermsSaveDto: UserPermsSaveDto): Promise<UserPermsRes> {
        const userPermissions = new this.userPermsModel(userPermsSaveDto);

        return await userPermissions.save();
    }

    async updateByUserId(
        userId: Types.ObjectId,
        userPermsUpdateDto: UserPermsUpdateDto,
    ): Promise<UserPermsRes> {
        return await this.userPermsModel.findOneAndUpdate(
            { userId },
            userPermsUpdateDto,
            { new: true },
        );
    }

    async deleteByUserId(userId: Types.ObjectId) {
        return await this.userPermsModel.findOneAndDelete({ userId });
    }
}
