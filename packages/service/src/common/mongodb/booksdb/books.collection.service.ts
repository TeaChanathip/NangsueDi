import { Injectable } from '@nestjs/common';
import { BookSaveDto } from './dtos/book.save.dto';
import { InjectModel } from '@nestjs/mongoose';
import { BooksModel } from './schemas/books.schema';
import { ClientSession, Model, PipelineStage, Types } from 'mongoose';
import { BooksSearchReqDto } from 'src/modules/books/dtos/books.search.req.dto';
import { BookRes } from './interfaces/book.res.interface';
import { BookUpdateDto } from './dtos/book.update.dto';

@Injectable()
export class BooksCollService {
    constructor(
        @InjectModel(BooksModel.name)
        private readonly booksModel: Model<BooksModel>,
    ) {}

    async findById(
        bookId: Types.ObjectId,
        session?: ClientSession,
    ): Promise<BookRes> {
        return await this.booksModel.findById(bookId).session(session);
    }

    async findByTitle(
        title: string,
        session?: ClientSession,
    ): Promise<BookRes> {
        return await this.booksModel.findOne({ title: title }).session(session);
    }

    async saveNew(
        bookSaveDto: BookSaveDto,
        session?: ClientSession,
    ): Promise<BookRes> {
        const book = new this.booksModel(bookSaveDto);
        return await book.save({ session });
    }

    async update(
        bookId: Types.ObjectId,
        bookUpdateDto: BookUpdateDto,
        session?: ClientSession,
    ): Promise<BookRes> {
        return await this.booksModel
            .findByIdAndUpdate(bookId, bookUpdateDto, {
                new: true,
            })
            .session(session);
    }

    async delete(
        bookId: Types.ObjectId,
        session?: ClientSession,
    ): Promise<BookRes> {
        return await this.booksModel.findByIdAndDelete(bookId).session(session);
    }

    async query(
        booksSearchReqDto: BooksSearchReqDto,
        session?: ClientSession,
    ): Promise<BookRes[]> {
        const {
            bookKeyword,
            publishedBegin,
            publishedEnd,
            registeredBegin,
            registeredEnd,
            updatedBegin,
            updatedEnd,
            totalLB,
            totalUB,
            borrowedLB,
            borrowedUB,
            remainLB,
            genres,
            limit,
            page,
        } = booksSearchReqDto;

        const pipeline: PipelineStage[] = [
            {
                $match: {
                    ...(bookKeyword && {
                        $or: [
                            { title: { $regex: bookKeyword, $options: 'i' } },
                            { author: { $regex: bookKeyword, $options: 'i' } },
                        ],
                    }),
                    ...(publishedBegin && {
                        publishedAt: { $gte: publishedBegin },
                    }),
                    ...(publishedEnd && {
                        publishedAt: { $lte: publishedEnd },
                    }),
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
                    ...(totalLB && {
                        total: { $gte: totalLB },
                    }),
                    ...(totalUB && {
                        total: { $lte: totalUB },
                    }),
                    ...(borrowedLB && {
                        borrowed: { $gte: borrowedLB },
                    }),
                    ...(borrowedUB && {
                        borrowed: { $lte: borrowedUB },
                    }),
                    ...(remainLB && {
                        $expr: {
                            $gte: [
                                {
                                    $subtract: [
                                        '$totalNumber',
                                        '$borrowedNumber',
                                    ],
                                },
                                remainLB,
                            ],
                        },
                    }),
                    ...(genres && { genres: { $all: genres } }),
                },
            },
            { $sort: { title: 1 } },
        ];

        if (page) {
            pipeline.push({ $skip: (page - 1) * limit });
        }

        if (limit) {
            pipeline.push({ $limit: limit });
        }

        return await this.booksModel.aggregate(pipeline).session(session);
    }

    async borrowed(
        bookId: Types.ObjectId,
        session?: ClientSession,
    ): Promise<BookRes> {
        return await this.booksModel
            .findByIdAndUpdate(
                bookId,
                {
                    $inc: { borrowed: 1 },
                },
                { new: true },
            )
            .session(session);
    }

    async returned(
        bookId: Types.ObjectId,
        session?: ClientSession,
    ): Promise<BookRes> {
        return await this.booksModel
            .findByIdAndUpdate(
                bookId,
                {
                    $inc: { borrowed: -1 },
                },
                { new: true },
            )
            .session(session);
    }
}
