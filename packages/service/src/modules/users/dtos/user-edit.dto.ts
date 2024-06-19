import { IsAlpha, IsOptional, IsPhoneNumber, IsUrl } from 'class-validator';

export class UserEditDto {
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
}
