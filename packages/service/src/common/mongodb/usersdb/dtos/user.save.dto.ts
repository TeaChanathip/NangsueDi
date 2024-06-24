import {
    IsAlpha,
    IsEmail,
    IsEnum,
    IsNotEmpty,
    IsNumber,
    IsOptional,
    IsPhoneNumber,
    IsString,
} from 'class-validator';
import { Role } from 'src/shared/enums/role.enum';

export class UserSaveDto {
    @IsNotEmpty()
    @IsEmail()
    email: string;

    @IsNotEmpty()
    @IsPhoneNumber()
    phone: string;

    @IsNotEmpty()
    @IsString()
    password: string;

    @IsNotEmpty()
    @IsAlpha()
    firstName: string;

    @IsOptional()
    @IsAlpha()
    lastName?: string;

    @IsNotEmpty()
    @IsEnum(Role)
    role: Role;

    @IsNotEmpty()
    @IsNumber()
    registeredAt: number;

    @IsNotEmpty()
    @IsNumber()
    tokenVersion: number;
}
