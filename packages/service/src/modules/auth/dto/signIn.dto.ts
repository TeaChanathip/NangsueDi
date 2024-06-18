import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class SignInDto {
    @ApiProperty({
        default: 'user1@gmail.com',
    })
    @IsNotEmpty()
    @IsEmail()
    'email': string;

    @ApiProperty({
        default: '111111',
    })
    @IsNotEmpty()
    @IsString()
    'password': string;
}
