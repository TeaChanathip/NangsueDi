import { Injectable } from '@nestjs/common';
import { BookSaveDto } from './dtos/book.save.dto';
import { InjectModel } from '@nestjs/mongoose';
import { BooksModel } from './schemas/books.schema';
import { Model } from 'mongoose';

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
}
