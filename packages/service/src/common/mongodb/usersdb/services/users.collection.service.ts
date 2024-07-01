import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { UsersModel } from '../schemas/users.schema';
import { Model, Types } from 'mongoose';
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

    async findById(userId: Types.ObjectId): Promise<UserRes> {
        return await this.usersModel.findById(userId);
    }

    async findByEmail(email: string): Promise<UserRes> {
        return await this.usersModel.findOne({ email });
    }

    async saveNew(userSaveDto: UserSaveDto): Promise<UserRes> {
        const newUser = new this.usersModel(userSaveDto);
        return await newUser.save();
    }

    async updateProfile(
        userId: Types.ObjectId,
        userUpdateDto: UserUpdateDto,
    ): Promise<UserRes> {
        return await this.usersModel.findByIdAndUpdate(userId, userUpdateDto, {
            new: true,
        });
    }

    async delete(userId: Types.ObjectId): Promise<UserRes> {
        return await this.usersModel.findByIdAndDelete(userId);
    }

    async updatePassword(
        userId: Types.ObjectId,
        passwordUpdateDto: PasswordUpdateDto,
    ): Promise<UserRes> {
        return await this.usersModel.findByIdAndUpdate(
            userId,
            passwordUpdateDto,
            {
                new: true,
            },
        );
    }

    async addPermissions(
        userId: Types.ObjectId,
        permissionsId: Types.ObjectId,
    ): Promise<UserRes> {
        return await this.usersModel.findByIdAndUpdate(
            userId,
            { permissions: permissionsId },
            { new: true },
        );
    }

    async getUserFiltered(userId: Types.ObjectId): Promise<UserFiltered> {
        const results = await this.usersModel.aggregate([
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
        ]);

        return results.length > 0 ? results[0] : null;
    }

    async suspend(
        userId: Types.ObjectId,
        suspendedAt: number,
        tokenVersion: number,
    ): Promise<UserRes> {
        return await this.usersModel.findByIdAndUpdate(
            userId,
            { suspendedAt, tokenVersion },
            { new: true },
        );
    }

    async unsuspend(userId: Types.ObjectId): Promise<UserRes> {
        return await this.usersModel.findByIdAndUpdate(
            userId,
            {
                $unset: { suspendedAt: '' },
            },
            { new: true },
        );
    }

    async query(
        adminsGetUsersReqDto: AdminsGetUsersReqDto,
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
        } = adminsGetUsersReqDto;

        return await this.usersModel.aggregate([
            {
                $match: {
                    ...(email && { email: { $regex: email, $options: 'i' } }),
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
            {
                $match: {
                    ...(canBorrow && { 'permissions.canBorrow': canBorrow }),
                    ...(canReview && { 'permissions.canReview': canReview }),
                },
            },
        ]);
    }

    async getAddresses(userId: Types.ObjectId): Promise<UserAddrsRes[]> {
        const addresses = await this.usersModel.aggregate([
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
        ]);

        const validAddresses = addresses.filter(
            (addr) => Object.keys(addr).length > 0,
        );
        return validAddresses.length > 0 ? validAddresses : [];
    }

    async addAddress(
        userId: Types.ObjectId,
        addrId: Types.ObjectId,
    ): Promise<UserRes> {
        return await this.usersModel.findByIdAndUpdate(
            userId,
            {
                $push: { addresses: addrId },
            },
            { new: true },
        );
    }

    async removeAddress(
        userId: Types.ObjectId,
        addrId: Types.ObjectId,
    ): Promise<UserRes> {
        return await this.usersModel.findByIdAndUpdate(userId, {
            $pull: { addresses: addrId },
        });
    }
}
