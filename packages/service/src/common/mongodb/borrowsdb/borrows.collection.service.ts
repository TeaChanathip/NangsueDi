import { Injectable } from '@nestjs/common';
import { BorrowsModel } from './schemas/borrows.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { BorrowSaveDto } from './dtos/borrow.save.dto';
import { BorrowRes } from './interfaces/borrow.res.dto';

@Injectable()
export class BorrowsCollService {
    constructor(
        @InjectModel(BorrowsModel.name)
        private readonly borrowsModel: Model<BorrowsModel>,
    ) {}

    async saveNew(borrowSaveDto: BorrowSaveDto): Promise<BorrowRes> {
        const borrow = new this.borrowsModel(borrowSaveDto);
        return await borrow.save();
    }

    async findByUserId(userId: Types.ObjectId): Promise<BorrowRes[]> {
        return await this.borrowsModel.find({ userId });
    }
}
