import {
    HttpException,
    HttpStatus,
    Injectable,
    InternalServerErrorException,
    NotFoundException,
} from '@nestjs/common';
import { BorrowReqDto } from './dtos/borrow.req.dto';
import { Types } from 'mongoose';
import { cvtToObjectId } from 'src/shared/utils/cvtToObjectId';
import { BorrowSaveDto } from 'src/common/mongodb/borrowsdb/dtos/borrow.save.dto';
import { getCurrentUnix } from 'src/shared/utils/getCurrentUnix';
import { BorrowsCollService } from 'src/common/mongodb/borrowsdb/borrows.collection.service';
import { BooksCollService } from 'src/common/mongodb/booksdb/books.collection.service';
import {
    MAX_BORROW,
    MAX_BORROW_PER_BOOK,
} from 'src/shared/consts/min-max.const';

@Injectable()
export class BorrowsService {
    constructor(
        private readonly borrowsCollService: BorrowsCollService,
        private readonly booksCollService: BooksCollService,
    ) {}

    async borrowBook(
        userId: Types.ObjectId,
        bookId: string,
        borrowReqDto: BorrowReqDto,
    ) {
        const bookObjId = cvtToObjectId(bookId, 'bookId');

        // Check if book is acutally exists and the amount is sufficient
        const book = await this.booksCollService.findById(bookObjId);
        if (!book) {
            throw new NotFoundException();
        }
        if (book.total - book.borrowed < borrowReqDto.amount) {
            throw new HttpException(
                'The requested amount exceeds the available number of books',
                HttpStatus.BAD_REQUEST,
            );
        }

        const borrows = await this.borrowsCollService.findByUserId(userId);
        if (!borrows) {
            // Check if the borrows will exceed the limit
            const total = borrows.reduce((sum, { amount }) => sum + amount, 0);
            if (total + borrowReqDto.amount > MAX_BORROW) {
                throw new HttpException(
                    `A user can borrow at most ${MAX_BORROW} books at a time`,
                    HttpStatus.BAD_REQUEST,
                );
            }

            // Check if the books that user going to borrow will exceed the limit
            const focusTotal = borrows
                .filter(({ bookId }) => String(bookId) === String(bookObjId))
                .reduce((sum, { amount }) => sum + amount, 0);
            if (focusTotal + borrowReqDto.amount > MAX_BORROW_PER_BOOK) {
                throw new HttpException(
                    `A user can borrow at most ${MAX_BORROW_PER_BOOK} of the same book at a time`,
                    HttpStatus.BAD_REQUEST,
                );
            }
        }

        const borrowedBook = this.booksCollService.borrowed(
            bookObjId,
            borrowReqDto.amount,
        );
        if (!borrowedBook) {
            throw new InternalServerErrorException();
        }

        const borrowSaveDto: BorrowSaveDto = {
            ...borrowReqDto,
            userId,
            bookId: bookObjId,
            timestamp: getCurrentUnix(),
        };

        return await this.borrowsCollService.saveNew(borrowSaveDto);
    }
}
