import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsMongoId, IsNotEmpty, IsString, MaxLength } from 'class-validator';
import { Types } from 'mongoose';
import { Trim } from 'src/common/transformers/trim.transformer';

export class AdminsDeleteUserReqDto {
    @ApiProperty({ type: Types.ObjectId, required: true, default: 'userId' })
    @IsNotEmpty()
    @IsMongoId()
    userId: Types.ObjectId;

    @ApiProperty({
        type: String,
        required: true,
        default: 'test test test',
        maxLength: 200,
    })
    @IsString()
    @Trim()
    @IsNotEmpty()
    @MaxLength(200)
    reasons: string;
}
