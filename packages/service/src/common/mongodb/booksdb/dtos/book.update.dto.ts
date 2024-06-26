import { IsNotEmpty } from 'class-validator';
import { IsUnix } from 'src/common/validators/isUnix.validator';

export class BookUpdateDto {
    title?: string;
    author?: string;
    description?: string;
    publishedAt?: number;
    total: number;
    genres?: number[];

    @IsNotEmpty()
    @IsUnix()
    updatedAt: number;
}
