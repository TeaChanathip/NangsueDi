import { Injectable } from '@nestjs/common';
import { BookSaveDto } from './dtos/book.save.dto';
import { InjectModel } from '@nestjs/mongoose';
import { BooksModel } from './schemas/books.schema';
import { Model } from 'mongoose';
import { BooksSearchReqDto } from 'src/modules/books/dtos/books.search.req.dto';

@Injectable()
export class BooksCollService {
    constructor(
        @InjectModel(BooksModel.name)
        private readonly booksModel: Model<BooksModel>,
    ) {}

    async findByTitle(title: string) {
        return await this.booksModel.findOne({ title: title });
    }

    async saveNew(bookSaveDto: BookSaveDto) {
        const book = new this.booksModel(bookSaveDto);
        return await book.save();
    }

    async query(booksSearchReqDto: BooksSearchReqDto) {
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

        return await this.booksModel.aggregate([
            {
                $match: {
                    ...(title && { title: { $regex: title } }),
                    ...(author && { author: { $regex: author } }),
                    ...(publishedAt && {
                        publishedAt: { $regex: publishedAt },
                    }),
                    ...(registeredAt && {
                        registeredAt: { $regex: registeredAt },
                    }),
                },
            },
        ]);
    }
}
