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
import mongoose, { Mongoose } from 'mongoose';
import { Roles } from '../enums/roles.enum';

export class UserDto {
    @IsNotEmpty()
    _id: mongoose.Schema.Types.ObjectId;

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
    @IsEnum(Roles)
    role: Roles;

    @IsOptional()
    permissions?: mongoose.Schema.Types.ObjectId;

    @IsNotEmpty()
    @IsNumber()
    registeredAt: number;

    @IsOptional()
    @IsNumber()
    updatedAt: number;
}
