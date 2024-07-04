import {
    HttpException,
    HttpStatus,
    Injectable,
    InternalServerErrorException,
} from '@nestjs/common';
import { Connection, Types } from 'mongoose';
import { BorrowsCollService } from '../../../common/mongodb/borrowsdb/borrows.collection.service';
import { ReturnSaveDto } from '../../../common/mongodb/returnsdb/dtos/return.save.dto';
import { ReturnsCollService } from '../../../common/mongodb/returnsdb/returns.collection.service';
import { cvtToObjectId } from '../../../shared/utils/cvtToObjectId';
import { getCurrentUnix } from '../../../shared/utils/getCurrentUnix';
import { ReturnsQueryReqDto } from '../../../common/mongodb/returnsdb/dtos/returns.query.req.dto';
import { ReturnFiltered } from '../../../common/mongodb/returnsdb/interfaces/return.filtered.interface';
import { transaction } from '../../../shared/utils/mongo.transaction';
import { InjectConnection } from '@nestjs/mongoose';

@Injectable()
export class ActionsReturnsService {
    constructor(
        @InjectConnection() private readonly connection: Connection,
        private readonly returnsCollService: ReturnsCollService,
        private readonly borrowsCollService: BorrowsCollService,
    ) {}

    async getReturns(
        userId: Types.ObjectId,
        ReturnsQueryReqDto: ReturnsQueryReqDto,
    ): Promise<ReturnFiltered[]> {
        return await this.returnsCollService.query(ReturnsQueryReqDto, userId);
    }

    async returnBook(
        userId: Types.ObjectId,
        borrowId: string,
    ): Promise<ReturnFiltered> {
        const borrowObjId = cvtToObjectId(borrowId, 'borrowId');

        // Check if the return request already submitted (need fixed)
        const foundReturns = await this.returnsCollService.query(
            { borrowedBegin: 0, requestedBegin: 0, limit: 1 },
            userId,
            borrowObjId,
        );
        if (foundReturns && foundReturns.length > 0) {
            throw new HttpException(
                'The user has already submitted this return request',
                HttpStatus.BAD_REQUEST,
            );
        }

        // Check if borrow request is user's, was already approved, and non-returned borrow
        const borrow = await this.borrowsCollService.findById(borrowObjId);
        if (!borrow || String(borrow.userId) !== String(userId)) {
            throw new HttpException(
                'This borrow request does not belong to the user',
                HttpStatus.FORBIDDEN,
            );
        }
        if (!borrow?.approvedAt) {
            throw new HttpException(
                'The borrow request has not been approved yet',
                HttpStatus.BAD_REQUEST,
            );
        }
        if (borrow?.returnedAt) {
            throw new HttpException(
                'The borrow request was already returned',
                HttpStatus.BAD_REQUEST,
            );
        }

        return transaction(this.connection, async (session) => {
            const returnSaveDto: ReturnSaveDto = {
                userId,
                bookId: borrow.bookId._id,
                borrowId: borrowObjId,
                borrowedAt: borrow.approvedAt,
                requestedAt: getCurrentUnix(),
            };

            const savedReturn =
                await this.returnsCollService.saveNew(returnSaveDto);
            if (!savedReturn) {
                throw new InternalServerErrorException();
            }

            const filteredReturn =
                await this.returnsCollService.getReturnFiltered(
                    savedReturn._id,
                );
            if (!filteredReturn) {
                throw new InternalServerErrorException();
            }

            return filteredReturn;
        });
    }

    async deleteReturn(
        userId: Types.ObjectId,
        returnId: string,
    ): Promise<ReturnFiltered> {
        const returnObjId = cvtToObjectId(returnId, 'returnId');

        const returnFiltered =
            await this.returnsCollService.getReturnFiltered(returnObjId);
        if (!returnFiltered || String(returnFiltered.user) === String(userId)) {
            throw new HttpException(
                'This return request does not belong to the user',
                HttpStatus.FORBIDDEN,
            );
        }
        if (returnFiltered?.approvedAt || returnFiltered?.rejectedAt) {
            throw new HttpException(
                'Deleting an approved or rejected return request is not allowed',
                HttpStatus.BAD_REQUEST,
            );
        }

        const deletedReturn =
            await this.returnsCollService.deleteById(returnObjId);
        if (!deletedReturn) {
            throw new InternalServerErrorException();
        }

        return returnFiltered;
    }
}
