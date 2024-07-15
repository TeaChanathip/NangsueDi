import { ApiProperty } from '@nestjs/swagger';
import {
    IsArray,
    IsInt,
    IsOptional,
    IsString,
    IsUrl,
    Max,
    MaxLength,
    Min,
    MinLength,
} from 'class-validator';
import { SortArray } from '../../../common/transformers/sort-array.transformer';
import { Trim } from '../../../common/transformers/trim.transformer';
import { IsUnix } from '../../../common/validators/isUnix.validator';
import { MAX_GENRE, MIN_GENRE } from '../../../shared/consts/genre.const';
import {
    MAX_NAME,
    MAX_TEXT,
    MAX_TITLE,
} from '../../../shared/consts/min-max.const';

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

    @ApiProperty({
        type: String,
        required: false,
        default:
            'https://bci.kinokuniya.com/jsp/images/book-img/97813/97813388/9781338878929.JPG',
    })
    @IsOptional()
    @Trim()
    @IsUrl()
    coverUrl?: string;
}
