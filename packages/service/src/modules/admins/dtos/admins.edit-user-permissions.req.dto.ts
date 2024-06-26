import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsMongoId, IsNotEmpty, IsOptional } from 'class-validator';
import { Types } from 'mongoose';

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
