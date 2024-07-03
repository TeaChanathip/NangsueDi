import { Type } from 'class-transformer';
import { IsBoolean, IsInt, IsMongoId, IsOptional, Min } from 'class-validator';
import { ClientSession, Types, mongo } from 'mongoose';

export class BorrowGetNonReturnedDto {
    @IsOptional()
    @IsMongoId()
    userId?: Types.ObjectId;

    @IsOptional()
    @IsBoolean()
    withUser?: boolean = false;

    @IsOptional()
    @Type(() => mongo.ClientSession)
    session?: ClientSession;

    @IsOptional()
    @IsInt()
    @Min(1)
    limit?: number;

    @IsOptional()
    @IsInt()
    @Min(1)
    page?: number;
}
