import { IsMongoId, IsOptional } from 'class-validator';
import { Types } from 'mongoose';
import { IsUnix } from 'src/common/validators/isUnix.validator';

export class BorrowsQueryRequest {
    @IsOptional()
    @IsMongoId()
    userId?: Types.ObjectId;

    @IsOptional()
    @IsMongoId()
    bookId?: Types.ObjectId;

    @IsOptional()
    @IsUnix()
    requestedBegin?: number;

    @IsOptional()
    @IsUnix()
    requestedEnd?: number;

    @IsOptional()
    @IsUnix()
    approvedBegin?: number;

    @IsOptional()
    @IsUnix()
    approvedEnd?: number;

    @IsOptional()
    @IsUnix()
    rejectedBegin?: number;

    @IsOptional()
    @IsUnix()
    rejectedEnd?: number;
}
