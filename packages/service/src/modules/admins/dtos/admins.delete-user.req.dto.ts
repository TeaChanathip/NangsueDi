import { ApiProperty } from '@nestjs/swagger';
import { IsMongoId, IsNotEmpty, IsString, MaxLength } from 'class-validator';
import { Types } from 'mongoose';

export class AdminsDeleteUserReqDto {
    @ApiProperty({ default: 'userId' })
    @IsNotEmpty()
    @IsMongoId()
    userId: Types.ObjectId;

    @ApiProperty({ default: 'test test test', maxLength: 200 })
    @IsNotEmpty()
    @IsString()
    @MaxLength(200)
    reasons: string;
}
