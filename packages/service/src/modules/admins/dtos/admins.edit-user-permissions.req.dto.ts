import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsOptional } from 'class-validator';

export class AdminsEditUserPermsReqDto {
    @ApiProperty({
        type: Boolean,
        required: false,
        default: false,
    })
    @IsOptional()
    @IsBoolean()
    canBorrow: boolean;

    @ApiProperty({
        type: Boolean,
        required: false,
        default: false,
    })
    @IsOptional()
    @IsBoolean()
    canReview: boolean;
}
