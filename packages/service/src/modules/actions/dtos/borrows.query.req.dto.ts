import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, MaxLength, MinLength } from 'class-validator';
import { Types } from 'mongoose';
import { Trim } from 'src/common/transformers/trim.transformer';
import { IsUnix } from 'src/common/validators/isUnix.validator';
import { MAX_TITLE } from 'src/shared/consts/min-max.const';

export class BorrowsQueryReqDto {
    @ApiProperty({ type: String, required: false })
    @IsOptional()
    @IsString()
    @Trim()
    @MinLength(1, { message: 'The bookTitle cannot be whitespace' })
    @MaxLength(MAX_TITLE)
    bookTitle?: Types.ObjectId;

    @ApiProperty({ type: Number, required: false })
    @IsOptional()
    @IsUnix()
    requestedBegin?: number;

    @ApiProperty({ type: Number, required: false })
    @IsOptional()
    @IsUnix()
    requestedEnd?: number;

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
    @IsUnix()
    rejectedBegin?: number;

    @ApiProperty({ type: Number, required: false })
    @IsOptional()
    @IsUnix()
    rejectedEnd?: number;
}
