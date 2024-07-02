import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, MaxLength } from 'class-validator';
import { Trim } from 'src/common/transformers/trim.transformer';
import { MAX_REASON, MAX_TEXT } from 'src/shared/consts/min-max.const';

export class AdminsSusUserReqDto {
    @ApiProperty({
        type: String,
        required: true,
        maxLength: MAX_REASON,
        default: 'test test test',
    })
    @IsString()
    @Trim()
    @IsNotEmpty()
    @MaxLength(MAX_REASON)
    reasons: string;
}
