import { ApiProperty } from '@nestjs/swagger';
import {
    IsInt,
    IsMongoId,
    IsOptional,
    IsString,
    Max,
    MaxLength,
    Min,
} from 'class-validator';
import { Types } from 'mongoose';
import { Trim } from '../../../transformers/trim.transformer';
import { IsUnix } from '../../../validators/isUnix.validator';
import { MAX_TITLE } from '../../../../shared/consts/min-max.const';

export class BorrowsQueryReqDto {
    @ApiProperty({ type: String, required: false })
    @IsOptional()
    @IsString()
    @Trim()
    @MaxLength(MAX_TITLE)
    bookKeyword?: string;

    @ApiProperty({ type: Number, required: false, default: 0 })
    @IsOptional()
    @IsUnix()
    requestedBegin?: number;

    @ApiProperty({ type: Number, required: false })
    @IsOptional()
    @IsUnix()
    requestedEnd?: number;

    @ApiProperty({ type: Number, required: false })
    @IsOptional()
    @IsInt()
    @Min(0)
    @Max(1)
    isApproved?: number;

    @ApiProperty({ type: Number, required: false })
    @IsOptional()
    @IsUnix()
    approvedBegin?: number;

    @ApiProperty({ type: Number, required: false })
    @IsOptional()
    @IsUnix()
    approvedEnd?: number;

    @ApiProperty({ type: Number, required: false })
    @IsOptional()
    @IsInt()
    @Min(0)
    @Max(1)
    isRejected?: number;

    @ApiProperty({ type: Number, required: false })
    @IsOptional()
    @IsUnix()
    rejectedBegin?: number;

    @ApiProperty({ type: Number, required: false })
    @IsOptional()
    @IsUnix()
    rejectedEnd?: number;

    @ApiProperty({ type: Number, required: false })
    @IsOptional()
    @IsInt()
    @Min(0)
    @Max(1)
    isReturned?: number;

    @ApiProperty({ type: Number, required: false })
    @IsOptional()
    @IsUnix()
    returnedBegin?: number;

    @ApiProperty({ type: Number, required: false })
    @IsOptional()
    @IsUnix()
    returnedEnd?: number;

    @ApiProperty({ type: Number, required: false })
    @IsOptional()
    @IsInt()
    @Min(1)
    limit?: number;

    @ApiProperty({ type: Number, required: false })
    @IsOptional()
    @IsInt()
    @Min(1)
    page?: number;
}

export class MgrBrwQueryReqDto extends BorrowsQueryReqDto {
    @ApiProperty({ type: String, required: false })
    @IsOptional()
    @IsMongoId()
    userId: Types.ObjectId;
}
