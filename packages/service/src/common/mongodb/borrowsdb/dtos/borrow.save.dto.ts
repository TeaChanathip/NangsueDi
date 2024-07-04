import { IsMongoId, IsNotEmpty } from 'class-validator';
import { Types } from 'mongoose';
import { IsUnix } from '../../../validators/isUnix.validator';

export class BorrowSaveDto {
    @IsNotEmpty()
    @IsMongoId()
    userId: Types.ObjectId;

    @IsNotEmpty()
    @IsMongoId()
    bookId: Types.ObjectId;

    @IsNotEmpty()
    @IsMongoId()
    addrId: Types.ObjectId;

    @IsNotEmpty()
    @IsUnix()
    requestedAt: number;
}
