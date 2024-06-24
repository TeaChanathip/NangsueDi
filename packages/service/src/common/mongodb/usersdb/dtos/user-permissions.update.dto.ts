import { IsBoolean, IsOptional } from 'class-validator';

export class UserPermsUpdateDto {
    @IsOptional()
    @IsBoolean()
    canBorrow?: boolean;

    @IsOptional()
    @IsBoolean()
    canReview?: boolean;
}
