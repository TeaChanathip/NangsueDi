import { Injectable } from '@nestjs/common';
import { BorrowsModel } from './schemas/borrows.schema';
import { InjectModel } from '@nestjs/mongoose';
import { ClientSession, Model, Types, mongo } from 'mongoose';
import { BorrowSaveDto } from './dtos/borrow.save.dto';
import { BorrowRes } from './interfaces/borrow.res.dto';

@Injectable()
export class BorrowsCollService {
    constructor(
        @InjectModel(BorrowsModel.name)
        private readonly borrowsModel: Model<BorrowsModel>,
    ) {}

    async saveNew(
        borrowSaveDto: BorrowSaveDto,
        session?: ClientSession,
    ): Promise<BorrowRes> {
        const borrow = new this.borrowsModel(borrowSaveDto);
        return await borrow.save({ session });
    }

    async findById(
        borrowId: Types.ObjectId,
        session?: ClientSession,
    ): Promise<BorrowRes> {
        return await this.borrowsModel.findById(borrowId).session(session);
    }

    async findByUserId(
        userId: Types.ObjectId,
        session?: ClientSession,
    ): Promise<BorrowRes[]> {
        return await this.borrowsModel.find({ userId }).session(session);
    }

    async rejectByBookId(
        bookId: Types.ObjectId,
        rejectedAt: number,
        session?: ClientSession,
    ): Promise<mongo.UpdateResult> {
        return await this.borrowsModel
            .updateMany({ bookId }, { rejectedAt })
            .session(session);
    }

    async deleteByBookId(
        bookId: Types.ObjectId,
        session?: ClientSession,
    ): Promise<mongo.DeleteResult> {
        return await this.borrowsModel.deleteMany({ bookId }).session(session);
    }

    async deleteById(
        borrowId: Types.ObjectId,
        session?: ClientSession,
    ): Promise<BorrowRes> {
        return await this.borrowsModel
            .findByIdAndDelete(borrowId)
            .session(session);
    }

    async query() {
        return;
    }
}
