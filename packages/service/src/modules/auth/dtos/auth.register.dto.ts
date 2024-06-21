import { ApiProperty } from '@nestjs/swagger';
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
import { Roles } from 'src/shared/enums/roles.enum';

export class AuthRegisterDto {
    @ApiProperty({
        default: 'test1@test.com',
    })
    @IsNotEmpty()
    @IsEmail()
    email: string;

    @ApiProperty({
        default: '+66 621111111',
    })
    @IsNotEmpty()
    @IsPhoneNumber()
    phone: string;

    @ApiProperty({
        default: '111111',
    })
    @IsNotEmpty()
    @IsString()
    password: string;

    @ApiProperty({
        default: 'firstone',
    })
    @IsNotEmpty()
    @IsAlpha()
    firstName: string;

    @ApiProperty({
        default: 'lastone',
    })
    @IsOptional()
    @IsAlpha()
    lastName?: string;
}

export class AuthRegisterPayload extends AuthRegisterDto {
    @IsNotEmpty()
    @IsEnum(Roles)
    role: Roles;

    @IsNotEmpty()
    @IsNumber()
    registeredAt: number;

    @IsNotEmpty()
    @IsNumber()
    tokenVersion: number;
}
