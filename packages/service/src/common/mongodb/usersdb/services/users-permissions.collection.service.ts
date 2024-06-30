import { Injectable } from '@nestjs/common';
import { UsersPermissionsModel } from '../schemas/users-permissions.schema';
import { Model, Types } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { UserPermsRes } from '../interfaces/user-permissions.res.interface';
import { UserPermsSaveDto } from '../dtos/user-permissions.save.dto';
import { AdminsEditUserPermsReqDto } from 'src/modules/admins/dtos/admins.edit-user-permissions.req.dto';

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
        adminsEditUserPermsReqDto: AdminsEditUserPermsReqDto,
    ): Promise<UserPermsRes> {
        return await this.userPermsModel.findOneAndUpdate(
            { userId },
            adminsEditUserPermsReqDto,
            { new: true },
        );
    }

    async deleteById(permsId: Types.ObjectId): Promise<UserPermsRes> {
        return await this.userPermsModel.findByIdAndDelete(permsId);
    }

    async deleteByUserId(userId: Types.ObjectId): Promise<UserPermsRes> {
        return await this.userPermsModel.findOneAndDelete({ userId });
    }
}
