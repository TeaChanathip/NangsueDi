import { ApiProperty } from '@nestjs/swagger';
import {
    IsEmail,
    IsNotEmpty,
    IsString,
    MaxLength,
    MinLength,
} from 'class-validator';
import { MAX_PWD, MIN_PWD } from 'src/shared/consts/length.const';

export class AuthLoginReqDto {
    @ApiProperty({
        default: 'test1@test.com',
    })
    @IsNotEmpty()
    @IsEmail()
    email: string;

    @ApiProperty({
        default: '111111',
    })
    @IsNotEmpty()
    @IsString()
    @MinLength(MIN_PWD)
    @MaxLength(MAX_PWD)
    password: string;
}
