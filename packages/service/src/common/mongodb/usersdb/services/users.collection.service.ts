import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { UsersModel } from '../schemas/users.schema';
import {
    ClientSession,
    HydratedDocument,
    Model,
    PipelineStage,
    Types,
} from 'mongoose';
import { UserRes } from '../interfaces/user.res.interface';
import { UserFiltered } from 'src/shared/interfaces/user.filtered.res.interface';
import { UserSaveDto } from '../dtos/user.save.dto';
import { UserUpdateDto } from '../dtos/user.update.dto';
import { PasswordUpdateDto } from '../dtos/password.update.dto';
import { AdminsGetUsersReqDto } from 'src/modules/admins/dtos/admins.get-users.req.dto';
import { UserAddrsRes } from '../interfaces/user-addresses.res.interface';

@Injectable()
export class UsersCollService {
    constructor(
        @InjectModel(UsersModel.name)
        private readonly usersModel: Model<UsersModel>,
    ) {}

    async findById(
        userId: Types.ObjectId,
        session?: ClientSession,
    ): Promise<HydratedDocument<UsersModel>> {
        return await this.usersModel.findById(userId).session(session);
    }

    async findByEmail(
        email: string,
        session?: ClientSession,
    ): Promise<UserRes> {
        return await this.usersModel.findOne({ email }).session(session);
    }

    async saveNew(
        userSaveDto: UserSaveDto,
        session?: ClientSession,
    ): Promise<UserRes> {
        const newUser = new this.usersModel(userSaveDto);
        return await newUser.save({ session });
    }

    async updateProfile(
        userId: Types.ObjectId,
        userUpdateDto: UserUpdateDto,
        session?: ClientSession,
    ): Promise<UserRes> {
        return await this.usersModel
            .findByIdAndUpdate(userId, userUpdateDto, {
                new: true,
            })
            .session(session);
    }

    async delete(
        userId: Types.ObjectId,
        session?: ClientSession,
    ): Promise<UserRes> {
        return await this.usersModel.findByIdAndDelete(userId).session(session);
    }

    async updatePassword(
        userId: Types.ObjectId,
        passwordUpdateDto: PasswordUpdateDto,
        session?: ClientSession,
    ): Promise<UserRes> {
        return await this.usersModel
            .findByIdAndUpdate(userId, passwordUpdateDto, {
                new: true,
            })
            .session(session);
    }

    async addPermissions(
        userId: Types.ObjectId,
        permissionsId: Types.ObjectId,
        session?: ClientSession,
    ): Promise<UserRes> {
        return await this.usersModel
            .findByIdAndUpdate(
                userId,
                { permissions: permissionsId },
                { new: true },
            )
            .session(session);
    }

    async getUserFiltered(
        userId: Types.ObjectId,
        session?: ClientSession,
    ): Promise<UserFiltered> {
        const results = await this.usersModel
            .aggregate([
                { $match: { _id: new Types.ObjectId(userId) } },
                {
                    $lookup: {
                        from: 'UsersPermissions',
                        localField: '_id',
                        foreignField: 'userId',
                        as: 'permissions',
                    },
                },
                {
                    $unwind: {
                        path: '$permissions',
                        preserveNullAndEmptyArrays: true,
                    },
                },
                {
                    $project: {
                        _id: 1,
                        email: 1,
                        phone: 1,
                        firstName: 1,
                        lastName: 1,
                        birthTime: 1,
                        avartarUrl: 1,
                        role: 1,
                        permissions: {
                            canBorrow: 1,
                            canReview: 1,
                        },
                        registeredAt: 1,
                        updatedAt: 1,
                        suspendedAt: 1,
                    },
                },
            ])
            .session(session);

        return results.length > 0 ? results[0] : null;
    }

    async suspend(
        userId: Types.ObjectId,
        suspendedAt: number,
        tokenVersion: number,
        session?: ClientSession,
    ): Promise<UserRes> {
        return await this.usersModel
            .findByIdAndUpdate(
                userId,
                { suspendedAt, tokenVersion },
                { new: true },
            )
            .session(session);
    }

    async unsuspend(
        userId: Types.ObjectId,
        session?: ClientSession,
    ): Promise<UserRes> {
        return await this.usersModel
            .findByIdAndUpdate(
                userId,
                {
                    $unset: { suspendedAt: '' },
                },
                { new: true },
            )
            .session(session);
    }

    async query(
        adminsGetUsersReqDto: AdminsGetUsersReqDto,
        session?: ClientSession,
    ): Promise<UserFiltered[]> {
        const {
            email,
            phone,
            firstName,
            lastName,
            roles,
            canBorrow,
            canReview,
            registeredBegin,
            registeredEnd,
            updatedBegin,
            updatedEnd,
            suspendedBegin,
            suspendedEnd,
            limit,
            page,
        } = adminsGetUsersReqDto;

        const pipeline: PipelineStage[] = [
            {
                $match: {
                    ...(email && {
                        email: { $regex: email, $options: 'i' },
                    }),
                    ...(phone && { phone: { $regex: phone } }),
                    ...(firstName && {
                        firstName: { $regex: firstName, $options: 'i' },
                    }),
                    ...(lastName && {
                        lastName: { $regex: lastName, $options: 'i' },
                    }),
                    ...(roles && { role: { $in: roles } }),
                    ...(registeredBegin && {
                        registeredAt: { $gte: registeredBegin },
                    }),
                    ...(registeredEnd && {
                        registeredAt: { $lte: registeredEnd },
                    }),
                    ...(updatedBegin && {
                        updatedAt: { $gte: updatedBegin },
                    }),
                    ...(updatedEnd && {
                        updatedAt: { $lte: updatedEnd },
                    }),
                    ...(suspendedBegin && {
                        suspendedAt: { $gte: suspendedBegin },
                    }),
                    ...(suspendedEnd && {
                        suspendedAt: { $lte: suspendedEnd },
                    }),
                },
            },
            {
                $lookup: {
                    from: 'UsersPermissions',
                    localField: 'permissions',
                    foreignField: '_id',
                    as: 'permissions',
                },
            },
            {
                $unwind: {
                    path: '$permissions',
                    preserveNullAndEmptyArrays: true,
                },
            },
            {
                $project: {
                    _id: 1,
                    email: 1,
                    phone: 1,
                    firstName: 1,
                    lastName: 1,
                    birthTime: 1,
                    avartarUrl: 1,
                    role: 1,
                    permissions: {
                        canBorrow: 1,
                        canReview: 1,
                    },
                    registeredAt: 1,
                    updatedAt: 1,
                    suspendedAt: 1,
                },
            },
            {
                $match: {
                    ...(canBorrow && {
                        'permissions.canBorrow': canBorrow,
                    }),
                    ...(canReview && {
                        'permissions.canReview': canReview,
                    }),
                },
            },
            { $sort: { _id: -1 } },
        ];

        if (page) {
            pipeline.push({ $skip: (page - 1) * limit });
        }

        if (limit) {
            pipeline.push({ $limit: limit });
        }

        return await this.usersModel.aggregate(pipeline).session(session);
    }

    async getAddresses(
        userId: Types.ObjectId,
        session?: ClientSession,
    ): Promise<UserAddrsRes[]> {
        const addresses = await this.usersModel
            .aggregate([
                {
                    $match: {
                        _id: new Types.ObjectId(userId),
                    },
                },
                {
                    $lookup: {
                        from: 'UsersAddresses',
                        localField: 'addresses',
                        foreignField: '_id',
                        as: 'addresses',
                    },
                },
                {
                    $unwind: {
                        path: '$addresses',
                        preserveNullAndEmptyArrays: true,
                    },
                },
                {
                    $project: {
                        _id: '$addresses._id',
                        address: '$addresses.address',
                        subDistrict: '$addresses.subDistrict',
                        district: '$addresses.district',
                        province: '$addresses.province',
                        postalCode: '$addresses.postalCode',
                    },
                },
            ])
            .session(session);

        const validAddresses = addresses.filter(
            (addr) => Object.keys(addr).length > 0,
        );
        return validAddresses.length > 0 ? validAddresses : [];
    }

    async addAddress(
        userId: Types.ObjectId,
        addrId: Types.ObjectId,
        session?: ClientSession,
    ): Promise<UserRes> {
        return await this.usersModel
            .findByIdAndUpdate(
                userId,
                {
                    $push: { addresses: addrId },
                },
                { new: true },
            )
            .session(session);
    }

    async removeAddress(
        userId: Types.ObjectId,
        addrId: Types.ObjectId,
        session?: ClientSession,
    ): Promise<UserRes> {
        return await this.usersModel
            .findByIdAndUpdate(userId, {
                $pull: { addresses: addrId },
            })
            .session(session);
    }
}
