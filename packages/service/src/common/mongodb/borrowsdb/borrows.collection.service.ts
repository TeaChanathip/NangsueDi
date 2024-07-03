import { Injectable } from '@nestjs/common';
import { BorrowsModel } from './schemas/borrows.schema';
import { InjectModel } from '@nestjs/mongoose';
import { ClientSession, Model, PipelineStage, Types, mongo } from 'mongoose';
import { BorrowSaveDto } from './dtos/borrow.save.dto';
import { BorrowRes } from './interfaces/borrow.res.interface';
import { BorrowsQueryReqDto } from 'src/common/mongodb/borrowsdb/dtos/borrows.query.req.dto';
import { BorrowFiltered } from './interfaces/borrow.filtered.interface';
import { BorrowUpdateDto } from './dtos/borrow.update.dto';
import { BorrowGetNonReturnedDto } from './dtos/borrow.get-non-returned.dto';

@Injectable()
export class BorrowsCollService {
    constructor(
        @InjectModel(BorrowsModel.name)
        private readonly borrowsModel: Model<BorrowsModel>,
    ) {}

    async saveNew(
        borrowSaveDto: BorrowSaveDto,
        session?: ClientSession,
    ): Promise<BorrowRes> {
        const borrow = new this.borrowsModel(borrowSaveDto);
        return await borrow.save({ session });
    }

    async findById(
        borrowId: Types.ObjectId,
        session?: ClientSession,
    ): Promise<BorrowRes> {
        return await this.borrowsModel.findById(borrowId).session(session);
    }

    async findByUserId(
        userId: Types.ObjectId,
        session?: ClientSession,
    ): Promise<BorrowRes[]> {
        return await this.borrowsModel.find({ userId }).session(session);
    }

    async updateById(
        borrowId: Types.ObjectId,
        borrowUpdateDto: BorrowUpdateDto,
        session?: ClientSession,
    ): Promise<BorrowRes> {
        return await this.borrowsModel
            .findByIdAndUpdate(borrowId, borrowUpdateDto, { new: true })
            .session(session);
    }

    async rejectByBookId(
        bookId: Types.ObjectId,
        rejectedAt: number,
        session?: ClientSession,
    ): Promise<mongo.UpdateResult> {
        return await this.borrowsModel
            .updateMany({ bookId }, { rejectedAt })
            .session(session);
    }

    async deleteByBookId(
        bookId: Types.ObjectId,
        session?: ClientSession,
    ): Promise<mongo.DeleteResult> {
        return await this.borrowsModel.deleteMany({ bookId }).session(session);
    }

    async deleteById(
        borrowId: Types.ObjectId,
        session?: ClientSession,
    ): Promise<BorrowRes> {
        return await this.borrowsModel
            .findByIdAndDelete(borrowId)
            .session(session);
    }

    async getBorrowFiltered(
        borrowId: Types.ObjectId,
        withUser: boolean = false,
        session?: ClientSession,
    ): Promise<BorrowFiltered> {
        const pipeline: PipelineStage[] = [
            { $match: { _id: new Types.ObjectId(borrowId) } },
            {
                $lookup: {
                    from: 'Books',
                    localField: 'bookId',
                    foreignField: '_id',
                    as: 'book',
                },
            },
            {
                $unwind: {
                    path: '$book',
                    preserveNullAndEmptyArrays: true,
                },
            },
            {
                $lookup: {
                    from: 'UsersAddresses',
                    localField: 'addrId',
                    foreignField: '_id',
                    as: 'address',
                },
            },
            {
                $unwind: {
                    path: '$address',
                    preserveNullAndEmptyArrays: true,
                },
            },
        ];

        this.addUserAndProject(pipeline, withUser);

        const results = await this.borrowsModel
            .aggregate(pipeline)
            .session(session);

        return results.length > 0 ? results[0] : null;
    }

    async query(
        BorrowsQueryReqDto: BorrowsQueryReqDto,
        userId?: Types.ObjectId,
        withUser: boolean = false,
        session?: ClientSession,
    ): Promise<BorrowFiltered[]> {
        const {
            bookKeyword,
            requestedBegin,
            requestedEnd,
            approvedBegin,
            approvedEnd,
            rejectedBegin,
            rejectedEnd,
            limit,
            page,
        } = BorrowsQueryReqDto;

        const pipeline: PipelineStage[] = [
            {
                $match: {
                    ...(userId && { userId: new Types.ObjectId(userId) }),
                    ...(requestedBegin && {
                        requestedAt: { $gte: requestedBegin },
                    }),
                    ...(requestedEnd && {
                        requestedAt: { $lte: requestedEnd },
                    }),
                    ...(approvedBegin && {
                        approvedAt: { $gte: approvedBegin },
                    }),
                    ...(approvedEnd && {
                        approvedAt: { $lte: approvedEnd },
                    }),
                    ...(rejectedBegin && {
                        rejectedAt: { $gte: rejectedBegin },
                    }),
                    ...(rejectedEnd && {
                        rejectedAt: { $lte: rejectedEnd },
                    }),
                },
            },
            {
                $lookup: {
                    from: 'Books',
                    localField: 'bookId',
                    foreignField: '_id',
                    as: 'book',
                },
            },
            {
                $unwind: {
                    path: '$book',
                    preserveNullAndEmptyArrays: true,
                },
            },
            {
                $match: {
                    ...(bookKeyword && {
                        $or: [
                            {
                                'book.title': {
                                    $regex: bookKeyword,
                                    $options: 'i',
                                },
                            },
                            {
                                'book.author': {
                                    $regex: bookKeyword,
                                    $options: 'i',
                                },
                            },
                        ],
                    }),
                },
            },
            {
                $lookup: {
                    from: 'UsersAddresses',
                    localField: 'addrId',
                    foreignField: '_id',
                    as: 'address',
                },
            },
            {
                $unwind: {
                    path: '$address',
                    preserveNullAndEmptyArrays: true,
                },
            },
        ];

        this.addUserAndProject(pipeline, withUser, limit, page);

        return await this.borrowsModel.aggregate(pipeline).session(session);
    }

    async getNonReturned(
        borrowGetNonReturnedDto: BorrowGetNonReturnedDto,
    ): Promise<BorrowFiltered[]> {
        const { userId, withUser, session, limit, page } =
            borrowGetNonReturnedDto;

        const pipeline: PipelineStage[] = [
            {
                $match: {
                    ...(userId && { userId: new Types.ObjectId(userId) }),
                },
            },
            {
                $lookup: {
                    from: 'Returns',
                    localField: '_id',
                    foreignField: 'borrowId',
                    as: 'return',
                },
            },
            {
                $unwind: {
                    path: '$return',
                    preserveNullAndEmptyArrays: true,
                },
            },
            {
                $match: {
                    $or: [
                        {
                            $and: [
                                { return: { $exists: true } },
                                { 'return.approvedAt': { $exists: false } },
                            ],
                        },
                        {
                            $and: [
                                { return: { $exists: false } },
                                { rejectedAt: { $exists: false } },
                            ],
                        },
                    ],
                },
            },
            {
                $lookup: {
                    from: 'Books',
                    localField: 'bookId',
                    foreignField: '_id',
                    as: 'book',
                },
            },
            {
                $unwind: {
                    path: '$book',
                    preserveNullAndEmptyArrays: true,
                },
            },
            {
                $lookup: {
                    from: 'UsersAddresses',
                    localField: 'addrId',
                    foreignField: '_id',
                    as: 'address',
                },
            },
            {
                $unwind: {
                    path: '$address',
                    preserveNullAndEmptyArrays: true,
                },
            },
        ];

        this.addUserAndProject(pipeline, withUser, limit, page);

        return await this.borrowsModel.aggregate(pipeline).session(session);
    }

    private addUserAndProject(
        pipeline: PipelineStage[],
        withUser: boolean,
        limit?: number,
        page?: number,
    ) {
        if (withUser) {
            pipeline.push(
                ...[
                    {
                        $lookup: {
                            from: 'Users',
                            localField: 'userId',
                            foreignField: '_id',
                            as: 'user',
                        },
                    },
                    {
                        $unwind: {
                            path: '$user',
                            preserveNullAndEmptyArrays: true,
                        },
                    },
                    {
                        $lookup: {
                            from: 'UsersPermissions',
                            localField: 'user.permissions',
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
                ],
            );
        }

        pipeline.push({
            $project: {
                _id: 1,
                ...(withUser && {
                    user: {
                        _id: 1,
                        email: 1,
                        phone: 1,
                        firstName: 1,
                        lastName: 1,
                        birthTime: 1,
                        avartarUrl: 1,
                        role: 1,
                        permissions: {
                            canBorrow: '$permissions.canBorrow',
                            canReview: '$permissions.canReview',
                        },
                        registeredAt: 1,
                        updatedAt: 1,
                        suspendedAt: 1,
                    },
                }),
                book: 1,
                address: 1,
                requestedAt: 1,
                approvedAt: 1,
                rejectedAt: 1,
            },
        });

        pipeline.push({ $sort: { _id: -1 } });

        if (page) {
            pipeline.push({ $skip: (page - 1) * limit });
        }

        if (limit) {
            pipeline.push({ $limit: limit });
        }
    }
}
