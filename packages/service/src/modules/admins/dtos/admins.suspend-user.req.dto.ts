import { ApiProperty } from '@nestjs/swagger';
import { IsMongoId, IsNotEmpty, IsString, MaxLength } from 'class-validator';
import { Types } from 'mongoose';
import { Trim } from 'src/common/transformers/trim.transformer';
import { MAX_TEXT } from 'src/shared/consts/length.const';

export class AdminsSusUserReqDto {
    @ApiProperty({ type: Types.ObjectId, required: true, default: 'userId' })
    @IsNotEmpty()
    @IsMongoId()
    userId: Types.ObjectId;

    @ApiProperty({
        type: String,
        required: true,
        maxLength: MAX_TEXT,
        default: 'test test test',
    })
    @IsString()
    @Trim()
    @IsNotEmpty()
    @MaxLength(MAX_TEXT)
    reasons: string;
}
