import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Types } from 'mongoose';
import { BooksCollService } from 'src/common/mongodb/booksdb/books.collection.service';
import { BorrowsCollService } from 'src/common/mongodb/borrowsdb/borrows.collection.service';
import { ReturnSaveDto } from 'src/common/mongodb/returnsdb/dtos/return.save.dto';
import { ReturnRes } from 'src/common/mongodb/returnsdb/interfaces/return.res.interface';
import { ReturnsCollService } from 'src/common/mongodb/returnsdb/returns.collection.service';
import { cvtToObjectId } from 'src/shared/utils/cvtToObjectId';
import { getCurrentUnix } from 'src/shared/utils/getCurrentUnix';

@Injectable()
export class ActionsReturnsService {
    constructor(
        private readonly returnsCollService: ReturnsCollService,
        private readonly borrowsCollService: BorrowsCollService,
    ) {}

    async getReturns(userId: Types.ObjectId): Promise<ReturnRes[]> {
        return await this.returnsCollService.findByUserId(userId);
    }

    async returnBook(
        userId: Types.ObjectId,
        borrowId: string,
    ): Promise<ReturnRes> {
        const borrowObjId = cvtToObjectId(borrowId, 'borrowId');
        const borrow = await this.borrowsCollService.findById(borrowObjId);
        if (!borrow || String(borrow.userId) !== String(userId)) {
            throw new HttpException(
                'This borrow request does not belong to the user',
                HttpStatus.BAD_REQUEST,
            );
        }

        const returnSaveDto: ReturnSaveDto = {
            userId,
            borrowId: borrowObjId,
            requestedAt: getCurrentUnix(),
        };

        return await this.returnsCollService.saveNew(returnSaveDto);
    }
}
