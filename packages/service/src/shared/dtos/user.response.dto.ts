import {
    IsAlpha,
    IsEmail,
    IsEnum,
    IsNotEmpty,
    IsOptional,
    IsPhoneNumber,
    IsUrl,
} from 'class-validator';
import { Roles } from '../enums/roles.enum';

export class UserResponseDto {
    @IsNotEmpty()
    @IsEmail()
    email: string;

    @IsNotEmpty()
    @IsPhoneNumber()
    phone: string;

    @IsNotEmpty()
    @IsAlpha()
    firstName: string;

    @IsOptional()
    @IsAlpha()
    lastName?: string;

    @IsOptional()
    @IsUrl()
    avartarUrl?: string;

    @IsNotEmpty()
    @IsEnum(Roles)
    role: Roles;
}
