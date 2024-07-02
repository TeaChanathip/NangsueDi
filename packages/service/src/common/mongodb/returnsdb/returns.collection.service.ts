import { Injectable } from '@nestjs/common';
import { ReturnSaveDto } from './dtos/return.save.dto';
import { ReturnRes } from './interfaces/return.res.interface';
import { InjectModel } from '@nestjs/mongoose';
import { ReturnsModel } from './schemas/returns.schema';
import { ClientSession, Model, PipelineStage, Types } from 'mongoose';
import { ReturnsQueryReqDto } from 'src/common/mongodb/returnsdb/dtos/returns.query.req.dto';
import { ReturnFiltered } from './interfaces/return.filtered.interface';
import { ReturnUpdateDto } from './dtos/return.update.dto';

@Injectable()
export class ReturnsCollService {
    constructor(
        @InjectModel(ReturnsModel.name)
        private readonly returnsModel: Model<ReturnsModel>,
    ) {}

    async saveNew(
        returnSaveDto: ReturnSaveDto,
        session?: ClientSession,
    ): Promise<ReturnRes> {
        const newReturn = new this.returnsModel(returnSaveDto);
        return await newReturn.save({ session });
    }

    async findById(
        returnId: Types.ObjectId,
        session?: ClientSession,
    ): Promise<ReturnRes> {
        return await this.returnsModel.findById(returnId).session(session);
    }

    async findByUserId(
        userId: Types.ObjectId,
        session?: ClientSession,
    ): Promise<ReturnRes[]> {
        return await this.returnsModel.find({ userId }).session(session);
    }

    async findByBorrowId(
        borrowId: Types.ObjectId,
        session?: ClientSession,
    ): Promise<ReturnRes> {
        return await this.returnsModel.findOne({ borrowId }).session(session);
    }

    async updateById(
        returnId: Types.ObjectId,
        returnUpdateDto: ReturnUpdateDto,
        session?: ClientSession,
    ): Promise<ReturnRes> {
        return await this.returnsModel
            .findByIdAndUpdate(returnId, returnUpdateDto, { new: true })
            .session(session);
    }

    async deleteById(returnId: Types.ObjectId, session?: ClientSession) {
        return await this.returnsModel
            .findByIdAndDelete(returnId)
            .session(session);
    }

    async getReturnFiltered(
        returnId: Types.ObjectId,
        withUser: boolean = false,
        session?: ClientSession,
    ): Promise<ReturnFiltered> {
        const pipeline: PipelineStage[] = [
            {
                $match: { _id: new Types.ObjectId(returnId) },
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
        ];

        this.addUserAndProject(pipeline, withUser);

        const results = await this.returnsModel
            .aggregate(pipeline)
            .session(session);

        return results.length > 0 ? results[0] : null;
    }

    async query(
        ReturnsQueryReqDto: ReturnsQueryReqDto,
        userId?: Types.ObjectId,
        withUser: boolean = false,
        session?: ClientSession,
    ): Promise<ReturnFiltered[]> {
        const {
            bookKeyword,
            borrowedBegin,
            borrowedEnd,
            rejectedBegin,
            requestedEnd,
            approvedBegin,
            approvedEnd,
            requestedBegin,
            rejectedEnd,
            limit,
            page,
        } = ReturnsQueryReqDto;

        const pipeline: PipelineStage[] = [
            {
                $match: {
                    ...(userId && { userId: new Types.ObjectId(userId) }),
                    ...(borrowedBegin && {
                        borrowedAt: { $gte: borrowedBegin },
                    }),
                    ...(borrowedEnd && {
                        borrowedAt: { $lte: borrowedEnd },
                    }),
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
                        requestedAt: { $lte: rejectedEnd },
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
        ];

        this.addUserAndProject(pipeline, withUser);

        if (page) {
            pipeline.push({ $skip: (page - 1) * limit });
        }

        if (limit) {
            pipeline.push({ $limit: limit });
        }

        return await this.returnsModel.aggregate(pipeline).session(session);
    }

    private addUserAndProject(pipeline: PipelineStage[], withUser: boolean) {
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
                borrowId: 1,
                borrowedAt: 1,
                requestedAt: 1,
                approvedAt: 1,
                rejectedAt: 1,
            },
        });

        pipeline.push({ $sort: { _id: -1 } });
    }
}
