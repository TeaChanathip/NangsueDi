import { ApiProperty } from '@nestjs/swagger';
import {
    IsAlpha,
    IsEmail,
    IsMobilePhone,
    IsNotEmpty,
    IsOptional,
    IsString,
    Matches,
    MaxLength,
    MinLength,
} from 'class-validator';
import { Trim } from 'src/common/transformers/trim.transformer';
import { MAX_NAME, MAX_PWD, MIN_PWD } from 'src/shared/consts/min-max.const';

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
    @MinLength(MIN_PWD)
    @MaxLength(MAX_PWD)
    password: string;

    @ApiProperty({
        default: 'firstone',
    })
    @IsAlpha()
    @Trim()
    @IsNotEmpty()
    @MaxLength(MAX_NAME)
    firstName: string;

    @ApiProperty({
        default: 'lastone',
    })
    @IsOptional()
    @IsAlpha()
    @Trim()
    @MinLength(1, { message: 'The lastName cannot be whitespace' })
    @MaxLength(MAX_NAME)
    lastName?: string;
}
