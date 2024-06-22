import {
    IsAlpha,
    IsNotEmpty,
    IsNumber,
    IsOptional,
    IsPhoneNumber,
    IsUrl,
} from 'class-validator';

export class UserUpdateDto {
    @IsOptional()
    @IsPhoneNumber()
    phone?: string;

    @IsOptional()
    @IsAlpha()
    firstName?: string;

    @IsOptional()
    @IsAlpha()
    lastName?: string;

    @IsOptional()
    @IsUrl()
    avartarUrl?: string;

    @IsNotEmpty()
    @IsNumber()
    updatedAt: number;
}
