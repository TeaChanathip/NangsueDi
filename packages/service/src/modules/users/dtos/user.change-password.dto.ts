import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class UserChangePasswordDto {
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

export class UserChangePasswordPayload {
    @IsNotEmpty()
    @IsString()
    password: string;

    @IsNotEmpty()
    @IsNumber()
    tokenVersion: number;
}
