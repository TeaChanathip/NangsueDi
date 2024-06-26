import {
    HttpException,
    HttpStatus,
    Injectable,
    NotFoundException,
} from '@nestjs/common';
import { BorrowReqDto } from './dtos/borrow.req.dto';
import { Types } from 'mongoose';
import { cvtToObjectId } from 'src/shared/utils/cvtToObjectId';
import { BorrowSaveDto } from 'src/common/mongodb/borrowsdb/dtos/borrow.save.dto';
import { getCurrentUnix } from 'src/shared/utils/getCurrentUnix';
import { BorrowsCollService } from 'src/common/mongodb/borrowsdb/borrows.collection.service';
import { BooksCollService } from 'src/common/mongodb/booksdb/books.collection.service';
import { MAX_BORROW } from 'src/shared/consts/min-max.const';

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
        if (
            borrows &&
            borrows.reduce((sum, { amount }) => sum + amount, 0) > MAX_BORROW
        ) {
            throw new HttpException(
                `A user can borrow at most ${MAX_BORROW} books at a time`,
                HttpStatus.BAD_REQUEST,
            );
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
