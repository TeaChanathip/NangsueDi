import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, MaxLength, MinLength } from 'class-validator';
import { MAX_PWD, MIN_PWD } from 'src/shared/consts/min-max.const';

export class AuthResetReqDto {
    @ApiProperty({ type: String, required: true, default: 'resetToken' })
    @IsNotEmpty()
    @IsString()
    resetToken: string;

    @ApiProperty({ type: String, required: true, default: '222222' })
    @IsNotEmpty()
    @IsString()
    @MinLength(MIN_PWD)
    @MaxLength(MAX_PWD)
    newPassword: string;
}
