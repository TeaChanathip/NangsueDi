import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class AdminsVerifyUserReqDto {
    @ApiProperty({ default: 'userId' })
    @IsNotEmpty()
    @IsString()
    userId: string;
}
