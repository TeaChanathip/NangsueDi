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
import { Types } from 'mongoose';
import { BooksUpdateReqDto } from './dtos/books.update.req.dto';
import { BookUpdateDto } from 'src/common/mongodb/booksdb/dtos/book.update.dto';
import { cvtToObjectId } from 'src/shared/utils/cvtToObjectId';
import { BorrowsCollService } from 'src/common/mongodb/borrowsdb/borrows.collection.service';
import { MAX_BORROW } from 'src/shared/consts/min-max.const';
import { BorrowSaveDto } from 'src/common/mongodb/borrowsdb/dtos/borrow.save.dto';

@Injectable()
export class BooksService {
    constructor(
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

        const deletedBook = await this.booksCollService.delete(bookObjId);
        if (!deletedBook) {
            throw new NotFoundException();
        }

        return deletedBook;
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

    async borrow(userId: Types.ObjectId, bookStrId: string) {
        const bookObjId = cvtToObjectId(bookStrId, 'bookId');

        // Check if book is acutally exists and the amount is sufficient
        const book = await this.booksCollService.findById(bookObjId);
        if (!book) {
            throw new NotFoundException();
        }
        if (book.total - book.borrowed <= 0) {
            throw new HttpException(
                'The requested amount exceeds the available number of books',
                HttpStatus.BAD_REQUEST,
            );
        }

        const borrows = await this.borrowsCollService.findByUserId(userId);
        if (borrows) {
            // Check if the borrows will exceed the limit
            const total = borrows.length;
            if (total + 1 > MAX_BORROW) {
                throw new HttpException(
                    `A user can borrow at most ${MAX_BORROW} books at a time`,
                    HttpStatus.BAD_REQUEST,
                );
            }

            // Check if the books that user is duplicated
            const isDuplicated = borrows.find(
                ({ bookId }) => String(bookId) === String(bookObjId),
            );
            if (isDuplicated) {
                throw new HttpException(
                    `A user can borrow only one copy of a book at a time`,
                    HttpStatus.BAD_REQUEST,
                );
            }
        }

        const borrowedBook = this.booksCollService.borrowed(bookObjId);
        if (!borrowedBook) {
            throw new InternalServerErrorException();
        }

        const borrowSaveDto: BorrowSaveDto = {
            userId,
            bookId: bookObjId,
            timestamp: getCurrentUnix(),
        };

        return await this.borrowsCollService.saveNew(borrowSaveDto);
    }

    private async findAndCheck(bookId: Types.ObjectId): Promise<BookRes> {
        const book = await this.booksCollService.findById(bookId);
        if (!book) {
            throw new NotFoundException();
        }

        return book;
    }
}
