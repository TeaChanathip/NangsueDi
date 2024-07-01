import {
    HttpException,
    HttpStatus,
    Injectable,
    NotFoundException,
} from '@nestjs/common';
import { Types } from 'mongoose';
import { BorrowsCollService } from 'src/common/mongodb/borrowsdb/borrows.collection.service';
import { BorrowRes } from 'src/common/mongodb/borrowsdb/interfaces/borrow.res.interface';
import { cvtToObjectId } from 'src/shared/utils/cvtToObjectId';
import { BorrowsReqDto } from '../dtos/borrows.req.dto';
import { UsersCollService } from 'src/common/mongodb/usersdb/services/users.collection.service';
import { BooksCollService } from 'src/common/mongodb/booksdb/books.collection.service';
import { MAX_BORROW } from 'src/shared/consts/min-max.const';
import { BorrowSaveDto } from 'src/common/mongodb/borrowsdb/dtos/borrow.save.dto';
import { getCurrentUnix } from 'src/shared/utils/getCurrentUnix';
import { BorrowsQueryReqDto } from '../dtos/borrows.query.req.dto';

@Injectable()
export class ActionsBorrowsService {
    constructor(
        private readonly borrowsCollService: BorrowsCollService,
        private readonly usersCollService: UsersCollService,
        private readonly booksCollService: BooksCollService,
    ) {}

    async getBorrows(
        userId: Types.ObjectId,
        borrowsQueryReqDto: BorrowsQueryReqDto,
    ): Promise<BorrowRes[]> {
        return await this.borrowsCollService.query(userId, borrowsQueryReqDto);
    }

    async deleteBorrow(
        userId: Types.ObjectId,
        borrowId: string,
    ): Promise<BorrowRes> {
        const borrowObjId = cvtToObjectId(borrowId, 'borrowId');

        // check if user own this borrow request
        const borrow = await this.borrowsCollService.findById(borrowObjId);
        if (!borrow || String(borrow.userId) !== String(userId)) {
            throw new HttpException(
                'The borrowId does not belong to the user',
                HttpStatus.BAD_REQUEST,
            );
        }
        if (borrow?.approvedAt) {
            throw new HttpException(
                'Cannot delete a verified borrow request',
                HttpStatus.BAD_REQUEST,
            );
        }

        return await this.borrowsCollService.deleteById(borrowObjId);
    }

    async borrow(
        userId: Types.ObjectId,
        bookStrId: string,
        borrowsReqDto: BorrowsReqDto,
    ) {
        // check if user own the address or not
        const { addresses } = await this.usersCollService.findById(userId);
        if (
            !addresses ||
            !addresses.find(
                (addrId) => String(addrId) === String(borrowsReqDto.addrId),
            )
        ) {
            throw new HttpException(
                'The user does not own this address',
                HttpStatus.BAD_REQUEST,
            );
        }

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

            // Check if the books is duplicated
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

        const borrowSaveDto: BorrowSaveDto = {
            userId,
            bookId: bookObjId,
            addrId: borrowsReqDto.addrId,
            requestedAt: getCurrentUnix(),
        };

        return await this.borrowsCollService.saveNew(borrowSaveDto);
    }
}
