import {
    HttpException,
    HttpStatus,
    Injectable,
    InternalServerErrorException,
    NotFoundException,
} from '@nestjs/common';
import { Connection, Types } from 'mongoose';
import { BorrowsCollService } from '../../../common/mongodb/borrowsdb/borrows.collection.service';
import { cvtToObjectId } from '../../../shared/utils/cvtToObjectId';
import { ActBorrowsReqDto } from '../dtos/actions.borrows.req.dto';
import { UsersCollService } from '../../../common/mongodb/usersdb/services/users.collection.service';
import { BooksCollService } from '../../../common/mongodb/booksdb/books.collection.service';
import { MAX_BORROW } from '../../../shared/consts/min-max.const';
import { BorrowSaveDto } from '../../../common/mongodb/borrowsdb/dtos/borrow.save.dto';
import { getCurrentUnix } from '../../../shared/utils/getCurrentUnix';
import { BorrowsQueryReqDto } from '../../../common/mongodb/borrowsdb/dtos/borrows.query.req.dto';
import { BorrowFiltered } from '../../../common/mongodb/borrowsdb/interfaces/borrow.filtered.interface';
import { InjectConnection } from '@nestjs/mongoose';
import { transaction } from '../../../shared/utils/mongo.transaction';
import { ActBrwGetNonRetReqDto } from '../dtos/actions.borrows.get-non-returned.req.dto';

@Injectable()
export class ActionsBorrowsService {
    constructor(
        @InjectConnection() private readonly connection: Connection,
        private readonly borrowsCollService: BorrowsCollService,
        private readonly usersCollService: UsersCollService,
        private readonly booksCollService: BooksCollService,
    ) {}

    async getBorrows(
        userId: Types.ObjectId,
        borrowsQueryReqDto: BorrowsQueryReqDto,
    ): Promise<BorrowFiltered[]> {
        return await this.borrowsCollService.query(borrowsQueryReqDto, userId);
    }

    async getNonReturned(
        userId: Types.ObjectId,
        actBrwGetNonRetReqDto: ActBrwGetNonRetReqDto,
    ): Promise<BorrowFiltered[]> {
        return await this.borrowsCollService.getNonReturned({
            userId,
            ...actBrwGetNonRetReqDto,
        });
    }

    async deleteBorrow(
        userId: Types.ObjectId,
        borrowId: string,
    ): Promise<BorrowFiltered> {
        const borrowObjId = cvtToObjectId(borrowId, 'borrowId');

        // check if user own this borrow request
        const borrow = await this.borrowsCollService.findById(borrowObjId);
        if (!borrow || String(borrow.userId) !== String(userId)) {
            throw new HttpException(
                'The borrowId does not belong to the user',
                HttpStatus.FORBIDDEN,
            );
        }
        if (borrow?.approvedAt || borrow?.rejectedAt) {
            throw new HttpException(
                'Deleting an approved or rejected borrow request is not allowed',
                HttpStatus.BAD_REQUEST,
            );
        }

        const borrowFiltered =
            await this.borrowsCollService.getBorrowFiltered(borrowObjId);
        if (!borrowFiltered) {
            throw new InternalServerErrorException();
        }

        const deletedBorrow =
            await this.borrowsCollService.deleteById(borrowObjId);
        if (!deletedBorrow) {
            throw new InternalServerErrorException();
        }

        return borrowFiltered;
    }

    async borrow(
        userId: Types.ObjectId,
        bookStrId: string,
        actBorrowsReqDto: ActBorrowsReqDto,
    ): Promise<BorrowFiltered> {
        // check if user own the address or not
        const { addresses } = await this.usersCollService.findById(userId);
        if (
            !addresses ||
            !addresses.find(
                (addrId) => String(addrId) === String(actBorrowsReqDto.addrId),
            )
        ) {
            throw new HttpException(
                'The user does not own this address',
                HttpStatus.FORBIDDEN,
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
                'No desired book is available',
                HttpStatus.BAD_REQUEST,
            );
        }

        const nonReturnedBorrows = await this.borrowsCollService.getNonReturned(
            { userId },
        );
        if (nonReturnedBorrows && nonReturnedBorrows.length > 0) {
            // Check if the borrows will exceed the limit
            const total = nonReturnedBorrows.length;
            if (total + 1 > MAX_BORROW) {
                throw new HttpException(
                    `A user can borrow at most ${MAX_BORROW} books at a time`,
                    HttpStatus.BAD_REQUEST,
                );
            }

            // Check if the books is duplicated
            const isDuplicated = nonReturnedBorrows.find(
                ({ book }) => String(book._id) === String(bookObjId),
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
            addrId: actBorrowsReqDto.addrId,
            requestedAt: getCurrentUnix(),
        };

        return transaction(this.connection, async (session) => {
            const savedBorrow = await this.borrowsCollService.saveNew(
                borrowSaveDto,
                session,
            );
            if (!savedBorrow) {
                throw new InternalServerErrorException();
            }

            const borrowFiltered =
                await this.borrowsCollService.getBorrowFiltered(
                    savedBorrow._id,
                    false,
                    session,
                );
            if (!borrowFiltered) {
                throw new InternalServerErrorException();
            }

            return borrowFiltered;
        });
    }
}
