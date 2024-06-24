import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class AdminsEditUserPermsDto {
    @ApiProperty({
        default: 'userId',
    })
    @IsNotEmpty()
    @IsString()
    userId: string;

    @ApiProperty({
        default: false,
    })
    @IsOptional()
    @IsBoolean()
    canBorrow: boolean;

    @ApiProperty({
        default: false,
    })
    @IsOptional()
    @IsBoolean()
    canReview: boolean;
}
