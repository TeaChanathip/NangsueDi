import { IsNotEmpty, IsNumber } from 'class-validator';
import { IsUnix } from 'src/common/validators/isUnix.validator';

export class BookSaveDto {
    title: string;
    author?: string;
    description?: string;
    total: number;
    genres?: number[];
    publishedAt?: number;
    coverUrl?: string;

    @IsNotEmpty()
    @IsUnix()
    registeredAt: number;

    @IsNotEmpty()
    @IsNumber()
    borrowed: number;
}
