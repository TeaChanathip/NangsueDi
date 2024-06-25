import { ApiProperty } from '@nestjs/swagger';
import {
    IsAlpha,
    IsEmail,
    IsMobilePhone,
    IsNotEmpty,
    IsOptional,
    IsString,
    Matches,
} from 'class-validator';

export class AuthRegisterReqDto {
    @ApiProperty({
        default: 'test1@test.com',
    })
    @IsNotEmpty()
    @IsEmail()
    email: string;

    @ApiProperty({
        default: '0611111111',
    })
    @IsNotEmpty()
    @IsMobilePhone('th-TH', null, {
        message: 'Phone number format is incorrect',
    })
    @Matches(/^0[0-9]*$/, { message: 'Phone number must start with 0' })
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
