import {
    IsAlpha,
    IsEmail,
    IsEnum,
    IsNotEmpty,
    IsNumber,
    IsOptional,
    IsPhoneNumber,
    IsString,
    IsUrl,
} from 'class-validator';
import { Role } from '../enums/role.enum';
import { Types } from 'mongoose';

export class UserDto {
    @IsNotEmpty()
    _id: Types.ObjectId;

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

    @IsOptional()
    @IsUrl()
    avartarUrl?: string;

    @IsNotEmpty()
    @IsEnum(Role)
    role: Role;

    @IsOptional()
    permissions?: Types.ObjectId;

    @IsNotEmpty()
    @IsNumber()
    registeredAt: number;

    @IsOptional()
    @IsNumber()
    updatedAt?: number;

    @IsNotEmpty()
    @IsNumber()
    tokenVersion: number;
}

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
    @IsEnum(Role)
    role: Role;
}
