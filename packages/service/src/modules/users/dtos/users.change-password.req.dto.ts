import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class UsersChangePasswordReqDto {
    @ApiProperty({
        default: '111111',
    })
    @IsNotEmpty()
    @IsString()
    password: string;

    @ApiProperty({
        default: '111111_',
    })
    @IsNotEmpty()
    @IsString()
    newPassword: string;
}
