import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, MaxLength, MinLength } from 'class-validator';
import { MAX_PWD, MIN_PWD } from '../../../shared/consts/min-max.const';

export class UsersChangePasswordReqDto {
    @ApiProperty({
        default: '111111',
    })
    @IsNotEmpty()
    @IsString()
    @MinLength(MIN_PWD)
    @MaxLength(MAX_PWD)
    password: string;

    @ApiProperty({
        default: '111111_',
    })
    @IsNotEmpty()
    @IsString()
    @MinLength(MIN_PWD)
    @MaxLength(MAX_PWD)
    newPassword: string;
}
