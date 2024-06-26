import { IsMongoId, IsNotEmpty } from 'class-validator';
import { Types } from 'mongoose';
import { IsUnix } from 'src/common/validators/isUnix.validator';

export class BorrowSaveDto {
    amount: number;

    @IsNotEmpty()
    @IsMongoId()
    userId: Types.ObjectId;

    @IsNotEmpty()
    @IsMongoId()
    bookId: Types.ObjectId;

    @IsNotEmpty()
    @IsUnix()
    timestamp: number;
}
