import { ApiProperty } from '@nestjs/swagger';
import {
    IsArray,
    IsInt,
    IsOptional,
    Max,
    MaxLength,
    Min,
} from 'class-validator';
import { Trim } from 'src/common/transformers/trim.transformer';
import { IsUnix } from 'src/common/validators/isUnix.validator';
import { MAX_GENRE, MIN_GENRE } from 'src/shared/consts/genre.map';
import { MAX_NAME, MAX_TITLE } from 'src/shared/consts/length.const';

export class BooksSearchReqDto {
    @ApiProperty({ type: String, required: false })
    @IsOptional()
    @Trim()
    @MaxLength(MAX_TITLE)
    title?: string;

    @ApiProperty({ type: String, required: false })
    @IsOptional()
    @MaxLength(2 * MAX_NAME)
    author?: string;

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
    @IsInt()
    @Min(1)
    remainNumberLB?: number;

    @ApiProperty({
        type: Number,
        isArray: true,
        uniqueItems: true,
        required: true,
    })
    @IsInt({ each: true })
    @Min(MIN_GENRE, { each: true })
    @Max(MAX_GENRE, { each: true })
    genres?: number[];

    limit?: number;
    page?: number;
}
