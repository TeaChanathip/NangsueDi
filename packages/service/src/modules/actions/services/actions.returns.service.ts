import {
    HttpException,
    HttpStatus,
    Injectable,
    InternalServerErrorException,
} from '@nestjs/common';
import { Connection, Types } from 'mongoose';
import { BorrowsCollService } from 'src/common/mongodb/borrowsdb/borrows.collection.service';
import { ReturnSaveDto } from 'src/common/mongodb/returnsdb/dtos/return.save.dto';
import { ReturnsCollService } from 'src/common/mongodb/returnsdb/returns.collection.service';
import { cvtToObjectId } from 'src/shared/utils/cvtToObjectId';
import { getCurrentUnix } from 'src/shared/utils/getCurrentUnix';
import { ReturnsQueryReqDto } from '../../../common/mongodb/returnsdb/dtos/returns.query.req.dto';
import { ReturnFiltered } from 'src/common/mongodb/returnsdb/interfaces/return.filtered.interface';
import { transaction } from 'src/shared/utils/mongo.transaction';
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
                HttpStatus.BAD_REQUEST,
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
