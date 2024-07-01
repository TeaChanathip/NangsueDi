import { IsMongoId, IsNotEmpty, IsOptional } from 'class-validator';
import { Types } from 'mongoose';
import { IsUnix } from 'src/common/validators/isUnix.validator';

export class ReturnSaveDto {
    @IsNotEmpty()
    @IsMongoId()
    userId: Types.ObjectId;

    @IsNotEmpty()
    @IsMongoId()
    borrowId: Types.ObjectId;

    @IsNotEmpty()
    @IsUnix()
    requestedAt: number;

    @IsOptional()
    @IsUnix()
    approvedAt?: number;
}
