import { Injectable } from '@nestjs/common';
import { UsersPermissionsModel } from '../schemas/users-permissions.schema';
import { ClientSession, Model, Types } from 'mongoose';
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

    async findByUserId(
        userId: Types.ObjectId,
        session?: ClientSession,
    ): Promise<UserPermsRes> {
        return await this.userPermsModel.findOne({ userId }).session(session);
    }

    async saveNew(
        userPermsSaveDto: UserPermsSaveDto,
        session?: ClientSession,
    ): Promise<UserPermsRes> {
        const userPermissions = new this.userPermsModel(userPermsSaveDto);

        return await userPermissions.save({ session });
    }

    async updateByUserId(
        userId: Types.ObjectId,
        adminsEditUserPermsReqDto: AdminsEditUserPermsReqDto,
        session?: ClientSession,
    ): Promise<UserPermsRes> {
        return await this.userPermsModel
            .findOneAndUpdate({ userId }, adminsEditUserPermsReqDto, {
                new: true,
            })
            .session(session);
    }

    async deleteById(
        permsId: Types.ObjectId,
        session?: ClientSession,
    ): Promise<UserPermsRes> {
        return await this.userPermsModel
            .findByIdAndDelete(permsId)
            .session(session);
    }

    async deleteByUserId(
        userId: Types.ObjectId,
        session?: ClientSession,
    ): Promise<UserPermsRes> {
        return await this.userPermsModel
            .findOneAndDelete({ userId })
            .session(session);
    }
}
