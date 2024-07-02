import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsOptional, IsString, MaxLength, Min } from 'class-validator';
import { Trim } from 'src/common/transformers/trim.transformer';
import { IsUnix } from 'src/common/validators/isUnix.validator';
import { MAX_TITLE } from 'src/shared/consts/min-max.const';

export class BorrowsQueryReqDto {
    @ApiProperty({ type: String, required: false })
    @IsOptional()
    @IsString()
    @Trim()
    @MaxLength(MAX_TITLE)
    bookKeyword?: string;

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
