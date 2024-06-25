import { IsNotEmpty, IsNumber } from 'class-validator';
import { IsUnix } from 'src/common/validators/isUnix.validator';

export class BookSaveDto {
    title: string;
    author?: string;
    description?: string;
    totalNumber: number;
    genres?: number[];
    publishedAt?: number;

    @IsNotEmpty()
    @IsUnix()
    registeredAt: number;

    @IsNotEmpty()
    @IsNumber()
    remainNumber: number;
}
