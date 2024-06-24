import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsMongoId, IsNotEmpty, IsOptional } from 'class-validator';
import { Types } from 'mongoose';

export class AdminsEditUserPermsReqDto {
    @ApiProperty({
        default: 'userId',
    })
    @IsNotEmpty()
    @IsMongoId()
    userId: Types.ObjectId;

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
