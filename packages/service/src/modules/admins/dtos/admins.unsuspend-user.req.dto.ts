import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class AdminsUnsusUserReqDto {
    @ApiProperty({ default: 'userId' })
    @IsNotEmpty()
    @IsString()
    userId: string;
}
