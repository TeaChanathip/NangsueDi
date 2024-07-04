import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, MaxLength } from 'class-validator';
import { Trim } from '../../../common/transformers/trim.transformer';
import { MAX_REASON } from '../../../shared/consts/min-max.const';

export class AdminsDeleteUserReqDto {
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
