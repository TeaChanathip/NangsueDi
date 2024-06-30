import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, MaxLength } from 'class-validator';
import { Trim } from 'src/common/transformers/trim.transformer';

export class AdminsDeleteUserReqDto {
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
