import { Injectable } from '@nestjs/common';
import { BookSaveDto } from './dtos/book.save.dto';
import { InjectModel } from '@nestjs/mongoose';
import { BooksModel } from './schemas/books.schema';
import { Model, PipelineStage, Types } from 'mongoose';
import { BooksSearchReqDto } from 'src/modules/books/dtos/books.search.req.dto';
import { BookRes } from './interfaces/book.res.interface';
import { BookUpdateDto } from './dtos/book.update.dto';

@Injectable()
export class BooksCollService {
    constructor(
        @InjectModel(BooksModel.name)
        private readonly booksModel: Model<BooksModel>,
    ) {}

    async findById(bookId: Types.ObjectId): Promise<BookRes> {
        return await this.booksModel.findById(bookId);
    }

    async findByTitle(title: string): Promise<BookRes> {
        return await this.booksModel.findOne({ title: title });
    }

    async saveNew(bookSaveDto: BookSaveDto): Promise<BookRes> {
        const book = new this.booksModel(bookSaveDto);
        return await book.save();
    }

    async update(
        bookId: Types.ObjectId,
        bookUpdateDto: BookUpdateDto,
    ): Promise<BookRes> {
        return await this.booksModel.findByIdAndUpdate(bookId, bookUpdateDto, {
            new: true,
        });
    }

    async delete(bookId: Types.ObjectId): Promise<BookRes> {
        return await this.booksModel.findByIdAndDelete(bookId);
    }

    async query(booksSearchReqDto: BooksSearchReqDto): Promise<BookRes[]> {
        const {
            title,
            author,
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
                    ...(title && { title: { $regex: title, $options: 'i' } }),
                    ...(author && {
                        author: { $regex: author, $options: 'i' },
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
        ];

        if (page) {
            pipeline.push({ $skip: (page - 1) * limit });
        }

        if (limit) {
            pipeline.push({ $limit: limit });
        }

        return await this.booksModel.aggregate(pipeline);
    }

    async borrowed(bookId: Types.ObjectId) {
        return await this.booksModel.findByIdAndUpdate(
            bookId,
            {
                $inc: { borrowed: 1 },
            },
            { new: true },
        );
    }
}
