import {
    HttpException,
    HttpStatus,
    Injectable,
    InternalServerErrorException,
    NotFoundException,
} from '@nestjs/common';
import { InjectConnection } from '@nestjs/mongoose';
import { Connection, Types } from 'mongoose';
import { BooksCollService } from 'src/common/mongodb/booksdb/books.collection.service';
import { BorrowsCollService } from 'src/common/mongodb/borrowsdb/borrows.collection.service';
import { BorrowUpdateDto } from 'src/common/mongodb/borrowsdb/dtos/borrow.update.dto';
import { BorrowFiltered } from 'src/common/mongodb/borrowsdb/interfaces/borrow.filtered.interface';
import { BorrowRes } from 'src/common/mongodb/borrowsdb/interfaces/borrow.res.interface';
import { ReturnsCollService } from 'src/common/mongodb/returnsdb/returns.collection.service';
import { cvtToObjectId } from 'src/shared/utils/cvtToObjectId';
import { getCurrentUnix } from 'src/shared/utils/getCurrentUnix';
import { transaction } from 'src/shared/utils/mongo.transaction';
import { MgrRejectReqDto } from './dtos/managers.reject.req.dto';
import { ReturnFiltered } from 'src/common/mongodb/returnsdb/interfaces/return.filtered.interface';
import { ReturnRes } from 'src/common/mongodb/returnsdb/interfaces/return.res.interface';
import { ReturnUpdateDto } from 'src/common/mongodb/returnsdb/dtos/return.update.dto';
import { MgrBrwQueryReqDto } from 'src/common/mongodb/borrowsdb/dtos/borrows.query.req.dto';
import { MgrRetQueryReqDto } from 'src/common/mongodb/returnsdb/dtos/returns.query.req.dto';

@Injectable()
export class ManagersService {
    constructor(
        @InjectConnection() private readonly connection: Connection,
        private readonly borrowsCollService: BorrowsCollService,
        private readonly returnsCollService: ReturnsCollService,
        private readonly booksCollService: BooksCollService,
    ) {}

    async getBorrows(
        mgrBrwQueryReqDto: MgrBrwQueryReqDto,
    ): Promise<BorrowFiltered[]> {
        return await this.borrowsCollService.query(
            mgrBrwQueryReqDto,
            mgrBrwQueryReqDto.userId,
            true,
        );
    }

    async approveBorrow(borrowId: string): Promise<BorrowFiltered> {
        const borrowObjId = cvtToObjectId(borrowId, 'borrowId');
        await this.checkBorrow(borrowObjId);

        const borrowUpdateDto: BorrowUpdateDto = {
            approvedAt: getCurrentUnix(),
        };

        return transaction(this.connection, async (session) => {
            // find and update borrow request
            const approvedBorrow = await this.borrowsCollService.updateById(
                borrowObjId,
                borrowUpdateDto,
                session,
            );
            if (!approvedBorrow) {
                throw new InternalServerErrorException();
            }

            // increase the borrowed number in Books document
            const borrowedBook = await this.booksCollService.borrowed(
                approvedBorrow.bookId._id,
                session,
            );
            if (!borrowedBook) {
                throw new InternalServerErrorException();
            }

            const borrowedFiltered =
                await this.borrowsCollService.getBorrowFiltered(
                    approvedBorrow._id,
                    true,
                    session,
                );
            if (!borrowedFiltered) {
                throw new InternalServerErrorException();
            }

            return borrowedFiltered;
        });
    }

    async rejectBorrow(
        borrowId: string,
        mgrRejectReqDto: MgrRejectReqDto,
    ): Promise<BorrowFiltered> {
        const borrowObjId = cvtToObjectId(borrowId, 'borrowId');
        await this.checkBorrow(borrowObjId);

        const borrowUpdateDto: BorrowUpdateDto = {
            rejectedAt: getCurrentUnix(),
            ...mgrRejectReqDto,
        };

        return transaction(this.connection, async (session) => {
            const rejectedBorrow = await this.borrowsCollService.updateById(
                borrowObjId,
                borrowUpdateDto,
                session,
            );
            if (!rejectedBorrow) {
                throw new InternalServerErrorException();
            }

            const borrowedFiltered =
                await this.borrowsCollService.getBorrowFiltered(
                    borrowObjId,
                    true,
                    session,
                );
            if (!borrowedFiltered) {
                throw new InternalServerErrorException();
            }

            return borrowedFiltered;
        });
    }

    private async checkBorrow(borrowId: Types.ObjectId): Promise<BorrowRes> {
        const borrow = await this.borrowsCollService.findById(borrowId);
        if (!borrow) {
            throw new NotFoundException();
        }
        if (borrow?.approvedAt || borrow?.rejectedAt) {
            throw new HttpException(
                'The borrow was already approved or rejected',
                HttpStatus.BAD_REQUEST,
            );
        }

        return borrow;
    }

    async getReturns(
        mgrRetQueryReqDto: MgrRetQueryReqDto,
    ): Promise<ReturnFiltered[]> {
        return await this.returnsCollService.query(
            mgrRetQueryReqDto,
            mgrRetQueryReqDto.userId,
            undefined,
            true,
        );
    }

    async approveReturn(returnId: string): Promise<ReturnFiltered> {
        const returnObjId = cvtToObjectId(returnId, 'returnId');
        await this.checkReturn(returnObjId);

        const currentUnix = getCurrentUnix();

        return transaction(this.connection, async (session) => {
            // find and update return request
            const approvedReturn = await this.returnsCollService.updateById(
                returnObjId,
                { approvedAt: currentUnix },
                session,
            );
            if (!approvedReturn) {
                throw new InternalServerErrorException();
            }

            // add returnedAt in borrow document
            const updatedBorrow = await this.borrowsCollService.updateById(
                approvedReturn.borrowId._id,
                { returnedAt: currentUnix },
            );
            if (!updatedBorrow) {
                throw new InternalServerErrorException();
            }

            // decrease borrowed number in Books document
            const returnedBook = await this.booksCollService.returned(
                approvedReturn.bookId._id,
                session,
            );
            if (!returnedBook) {
                throw new InternalServerErrorException();
            }

            const returnFiltered =
                await this.returnsCollService.getReturnFiltered(
                    approvedReturn._id,
                    true,
                    session,
                );
            if (!returnFiltered) {
                throw new InternalServerErrorException();
            }

            return returnFiltered;
        });
    }

    async rejectReturn(
        returnId: string,
        mgrRejectReqDto: MgrRejectReqDto,
    ): Promise<ReturnFiltered> {
        const returnObjId = cvtToObjectId(returnId, 'returnId');
        await this.checkReturn(returnObjId);

        const returnUpdateDto: ReturnUpdateDto = {
            rejectedAt: getCurrentUnix(),
            ...mgrRejectReqDto,
        };

        return transaction(this.connection, async (session) => {
            const rejectedReturn = await this.returnsCollService.updateById(
                returnObjId,
                returnUpdateDto,
                session,
            );
            if (!rejectedReturn) {
                throw new InternalServerErrorException();
            }

            const returnFiltered = this.returnsCollService.getReturnFiltered(
                returnObjId,
                true,
                session,
            );
            if (!returnFiltered) {
                throw new InternalServerErrorException();
            }

            return returnFiltered;
        });
    }

    private async checkReturn(returnId: Types.ObjectId): Promise<ReturnRes> {
        const returnItem = await this.returnsCollService.findById(returnId);
        if (!returnItem) {
            throw new NotFoundException();
        }
        if (returnItem?.approvedAt || returnItem?.rejectedAt) {
            throw new HttpException(
                'The return was already approved or rejected',
                HttpStatus.BAD_REQUEST,
            );
        }

        return returnItem;
    }
}
