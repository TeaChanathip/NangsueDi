import { ApiProperty } from '@nestjs/swagger';
import {
    ArrayUnique,
    IsInt,
    IsOptional,
    Max,
    MaxLength,
    Min,
} from 'class-validator';
import { ToArray } from '../../../common/transformers/to-array.transformer';
import { Trim } from '../../../common/transformers/trim.transformer';
import { IsUnix } from '../../../common/validators/isUnix.validator';
import { MAX_GENRE, MIN_GENRE } from '../../../shared/consts/genre.const';
import { MAX_TITLE } from '../../../shared/consts/min-max.const';

export class BooksSearchReqDto {
    @ApiProperty({ type: String, required: false })
    @IsOptional()
    @Trim()
    @MaxLength(MAX_TITLE)
    bookKeyword?: string;

    @ApiProperty({ type: Number, required: false })
    @IsOptional()
    @IsUnix()
    publishedBegin?: number;

    @ApiProperty({ type: Number, required: false })
    @IsOptional()
    @IsUnix()
    publishedEnd?: number;

    @ApiProperty({ type: Number, required: false })
    @IsOptional()
    @IsUnix()
    registeredBegin?: number;

    @ApiProperty({ type: Number, required: false })
    @IsOptional()
    @IsUnix()
    registeredEnd?: number;

    @ApiProperty({ type: Number, required: false })
    @IsOptional()
    @IsUnix()
    updatedBegin?: number;

    @ApiProperty({ type: Number, required: false })
    @IsOptional()
    @IsUnix()
    updatedEnd?: number;

    @ApiProperty({ type: Number, required: false })
    @IsOptional()
    @IsInt()
    @Min(1)
    totalLB?: number;

    @ApiProperty({ type: Number, required: false })
    @IsOptional()
    @IsInt()
    @Min(1)
    totalUB?: number;

    @ApiProperty({ type: Number, required: false })
    @IsOptional()
    @IsInt()
    @Min(0)
    borrowedLB?: number;

    @ApiProperty({ type: Number, required: false })
    @IsOptional()
    @IsInt()
    @Min(0)
    borrowedUB?: number;

    @ApiProperty({ type: Number, required: false })
    @IsOptional()
    @IsInt()
    @Min(1)
    remainLB?: number;

    @ApiProperty({
        type: Number,
        isArray: true,
        uniqueItems: true,
        required: false,
    })
    @IsOptional()
    @IsInt({ each: true })
    @ArrayUnique()
    @ToArray({ type: 'number' })
    @Min(MIN_GENRE, { each: true })
    @Max(MAX_GENRE, { each: true })
    genres?: number[];

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
