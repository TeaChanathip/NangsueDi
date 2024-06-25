import { Injectable } from '@nestjs/common';
import { BookSaveDto } from './dtos/book.save.dto';
import { InjectModel } from '@nestjs/mongoose';
import { BooksModel } from './schemas/books.schema';
import { Model, PipelineStage } from 'mongoose';
import { BooksSearchReqDto } from 'src/modules/books/dtos/books.search.req.dto';
import { BookRes } from './interfaces/book.res.interface';

@Injectable()
export class BooksCollService {
    constructor(
        @InjectModel(BooksModel.name)
        private readonly booksModel: Model<BooksModel>,
    ) {}

    async findByTitle(title: string): Promise<BookRes> {
        return await this.booksModel.findOne({ title: title });
    }

    async saveNew(bookSaveDto: BookSaveDto): Promise<BookRes> {
        const book = new this.booksModel(bookSaveDto);
        return await book.save();
    }

    async query(booksSearchReqDto: BooksSearchReqDto): Promise<BookRes[]> {
        const {
            title,
            author,
            publishedBegin,
            publishedEnd,
            registeredBegin,
            registeredEnd,
            remainNumberLB,
            genres,
            limit,
            page,
        } = booksSearchReqDto;

        const pipeline: PipelineStage[] = [
            {
                $match: {
                    ...(title && { title: { $regex: title } }),
                    ...(author && { author: { $regex: author } }),
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
                    ...(remainNumberLB && {
                        remainNumber: { $gte: remainNumberLB },
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
}
