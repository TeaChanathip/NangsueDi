import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class AdminsSusUserReqDto {
    @ApiProperty({ default: 'userId' })
    @IsNotEmpty()
    @IsString()
    userId: string;

    @ApiProperty({ default: 'test test test', maxLength: 200 })
    @IsNotEmpty()
    @IsString()
    @MaxLength(200)
    reasons: string;
}
