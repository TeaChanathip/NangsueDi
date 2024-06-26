import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, MaxLength, MinLength } from 'class-validator';
import { MAX_PWD, MIN_PWD } from 'src/shared/consts/min-max.const';

export class UserDeleteReqDto {
    @ApiProperty({
        default: '111111',
    })
    @IsNotEmpty()
    @IsString()
    @MinLength(MIN_PWD)
    @MaxLength(MAX_PWD)
    password: string;
}
