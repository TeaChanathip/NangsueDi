import {
    HttpException,
    HttpStatus,
    Injectable,
    InternalServerErrorException,
    NotFoundException,
} from '@nestjs/common';
import { BooksCollService } from 'src/common/mongodb/booksdb/books.collection.service';
import { BooksRegisterReqDto } from './dtos/books.register.req.dto';
import { BookSaveDto } from 'src/common/mongodb/booksdb/dtos/book.save.dto';
import { getCurrentUnix } from 'src/shared/utils/getCurrentUnix';
import { BooksSearchReqDto } from './dtos/books.search.req.dto';
import { BookRes } from 'src/common/mongodb/booksdb/interfaces/book.res.interface';
import { Connection, Types } from 'mongoose';
import { BooksUpdateReqDto } from './dtos/books.update.req.dto';
import { BookUpdateDto } from 'src/common/mongodb/booksdb/dtos/book.update.dto';
import { cvtToObjectId } from 'src/shared/utils/cvtToObjectId';
import { BorrowsCollService } from 'src/common/mongodb/borrowsdb/borrows.collection.service';
import { transaction } from 'src/shared/utils/mongo.transaction';
import { InjectConnection } from '@nestjs/mongoose';

@Injectable()
export class BooksService {
    constructor(
        @InjectConnection() private readonly connection: Connection,
        private readonly booksCollService: BooksCollService,
        private readonly borrowsCollService: BorrowsCollService,
    ) {}

    async register(booksRegisterReqDto: BooksRegisterReqDto): Promise<BookRes> {
        const book = await this.booksCollService.findByTitle(
            booksRegisterReqDto.title,
        );
        if (book) {
            throw new HttpException(
                'This title was already registered',
                HttpStatus.BAD_REQUEST,
            );
        }

        const bookSaveDto: BookSaveDto = {
            ...booksRegisterReqDto,
            registeredAt: getCurrentUnix(),
            borrowed: 0,
        };

        return await this.booksCollService.saveNew(bookSaveDto);
    }

    async get(bookId: string): Promise<BookRes> {
        const bookObjId = cvtToObjectId(bookId, 'bookId');
        return await this.booksCollService.findById(bookObjId);
    }

    async update(
        bookId: string,
        booksUpdateReqDto: BooksUpdateReqDto,
    ): Promise<BookRes> {
        const bookObjId = cvtToObjectId(bookId, 'bookId');

        const book = await this.findAndCheck(bookObjId);
        if (book.borrowed !== 0 && booksUpdateReqDto?.title) {
            throw new HttpException(
                'Changing the title is not allowed when the book is borrowed',
                HttpStatus.BAD_REQUEST,
            );
        }
        if (
            booksUpdateReqDto?.total &&
            book.borrowed > booksUpdateReqDto.total
        ) {
            throw new HttpException(
                'The total cannot be less than the borrowed',
                HttpStatus.BAD_REQUEST,
            );
        }

        const dupTitleBook = await this.booksCollService.findByTitle(
            booksUpdateReqDto.title,
        );
        if (dupTitleBook && String(dupTitleBook._id) !== String(book._id)) {
            throw new HttpException(
                'The title has already been used',
                HttpStatus.BAD_REQUEST,
            );
        }

        const bookUpdateDto: BookUpdateDto = {
            ...booksUpdateReqDto,
            updatedAt: getCurrentUnix(),
        };

        return await this.booksCollService.update(bookObjId, bookUpdateDto);
    }

    async delete(bookId: string): Promise<BookRes> {
        const bookObjId = cvtToObjectId(bookId, 'bookId');
        const book = await this.booksCollService.findById(bookObjId);
        if (book.borrowed !== 0) {
            throw new HttpException(
                'Deleting the book is not allowed when it is borrowed',
                HttpStatus.BAD_REQUEST,
            );
        }

        return transaction(this.connection, async (session) => {
            const rejectedBorrow = await this.borrowsCollService.rejectByBookId(
                bookObjId,
                getCurrentUnix(),
                session,
            );
            if (!rejectedBorrow || !rejectedBorrow.acknowledged) {
                throw new InternalServerErrorException();
            }

            const deletedBook = await this.booksCollService.delete(
                bookObjId,
                session,
            );
            if (!deletedBook) {
                throw new NotFoundException();
            }

            return deletedBook;
        });
    }

    async search(booksSearchReqDto: BooksSearchReqDto): Promise<BookRes[]> {
        if (booksSearchReqDto.page && !booksSearchReqDto.limit) {
            throw new HttpException(
                'The page parameter requires the limit parameter',
                HttpStatus.BAD_REQUEST,
            );
        }
        return await this.booksCollService.query(booksSearchReqDto);
    }

    private async findAndCheck(bookId: Types.ObjectId): Promise<BookRes> {
        const book = await this.booksCollService.findById(bookId);
        if (!book) {
            throw new NotFoundException();
        }

        return book;
    }
}
