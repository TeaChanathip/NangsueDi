import { ApiProperty } from '@nestjs/swagger';
import {
    IsArray,
    IsInt,
    IsOptional,
    IsString,
    Max,
    MaxLength,
    Min,
    MinLength,
} from 'class-validator';
import { SortArray } from 'src/common/transformers/sort-array.transformer';
import { Trim } from 'src/common/transformers/trim.transformer';
import { IsUnix } from 'src/common/validators/isUnix.validator';
import { MAX_GENRE, MIN_GENRE } from 'src/shared/consts/genre.map';
import { MAX_NAME, MAX_TEXT, MAX_TITLE } from 'src/shared/consts/length.const';

export class BooksUpdateReqDto {
    @ApiProperty({ type: String, required: true, default: 'Harry Potter 1st' })
    @IsOptional()
    @IsString()
    @Trim()
    @MinLength(1, { message: 'The title cannot be whitespace' })
    @MaxLength(MAX_TITLE)
    title?: string;

    @ApiProperty({ type: String, required: false, default: 'JK Rowling' })
    @IsOptional()
    @IsString()
    @Trim()
    @MinLength(1, { message: 'The author cannot be whitespace' })
    @MaxLength(2 * MAX_NAME)
    author?: string;

    @ApiProperty({
        type: String,
        required: false,
        default:
            'The novels chronicle the lives of a young wizard, Harry Potter, and his friends Hermione Granger and Ron Weasley, all of whom are students at Hogwarts School of Witchcraft and Wizardry.',
    })
    @IsOptional()
    @IsString()
    @Trim()
    @MinLength(1, { message: 'The description cannot be whitespace' })
    @MaxLength(MAX_TEXT)
    description?: string;

    @ApiProperty({
        type: Number,
        required: false,
        default: 1,
    })
    @IsOptional()
    @IsUnix()
    publishedAt?: number;

    @ApiProperty({ type: Number, required: true, default: '10' })
    @IsOptional()
    @IsInt()
    @Min(1)
    total: number;

    @ApiProperty({
        type: Number,
        isArray: true,
        required: true,
        default: [0, 5, 7],
    })
    @IsOptional()
    @IsArray()
    @IsInt({ each: true })
    @Min(MIN_GENRE, { each: true })
    @Max(MAX_GENRE, { each: true })
    @SortArray({ order: 'asce', type: 'number' })
    genres?: number[];
}
