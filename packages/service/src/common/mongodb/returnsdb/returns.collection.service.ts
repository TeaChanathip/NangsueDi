import { Injectable } from '@nestjs/common';
import { ReturnSaveDto } from './dtos/return.save.dto';
import { ReturnRes } from './interfaces/return.res.interface';
import { InjectModel } from '@nestjs/mongoose';
import { ReturnsModel } from './schemas/returns.schema';
import { Model, Types } from 'mongoose';

@Injectable()
export class ReturnsCollService {
    constructor(
        @InjectModel(ReturnsModel.name)
        private readonly returnsModel: Model<ReturnsModel>,
    ) {}

    async saveNew(returnSaveDto: ReturnSaveDto): Promise<ReturnRes> {
        const newReturn = new this.returnsModel(returnSaveDto);
        return await newReturn.save();
    }

    async findByUserId(userId: Types.ObjectId): Promise<ReturnRes[]> {
        return await this.returnsModel.find({ userId });
    }
}
