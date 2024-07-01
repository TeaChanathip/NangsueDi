import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Types } from 'mongoose';
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

        const foundReturn =
            await this.returnsCollService.findByBorrowId(borrowObjId);
        if (foundReturn) {
            if (String(foundReturn.userId) === String(userId)) {
                throw new HttpException(
                    'The user has already submitted this return request',
                    HttpStatus.BAD_REQUEST,
                );
            } else {
                throw new HttpException(
                    'This borrow request does not belong to the user',
                    HttpStatus.BAD_REQUEST,
                );
            }
        }

        const borrow = await this.borrowsCollService.findById(borrowObjId);
        if (!borrow || String(borrow.userId) !== String(userId)) {
            throw new HttpException(
                'This borrow request does not belong to the user',
                HttpStatus.BAD_REQUEST,
            );
        }
        if (!borrow?.approvedAt) {
            throw new HttpException(
                'The borrow request has not been approved yet',
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
