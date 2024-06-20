import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class UserDeleteDto {
    @ApiProperty({
        default: '111111',
    })
    @IsNotEmpty()
    @IsString()
    password: string;
}
