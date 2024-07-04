import { ApiProperty } from '@nestjs/swagger';
import {
    IsAlpha,
    IsMobilePhone,
    IsOptional,
    IsUrl,
    Matches,
    MaxLength,
    MinLength,
} from 'class-validator';
import { Trim } from '../../../common/transformers/trim.transformer';
import { IsOlderThan } from '../../../common/validators/isOlderThan.validator';
import { IsUnix } from '../../../common/validators/isUnix.validator';
import { MAX_NAME } from '../../../shared/consts/min-max.const';

export class UserUpdateReqDto {
    @ApiProperty({
        default: '0911111111',
    })
    @IsOptional()
    @IsMobilePhone('th-TH', null, {
        message: 'Phone number format is incorrect',
    })
    @Matches(/^0[0-9]*$/, { message: 'Phone number must start with 0' })
    phone?: string;

    @ApiProperty({
        default: 'fupdatedone',
    })
    @IsOptional()
    @IsAlpha()
    @Trim()
    @MinLength(1, { message: 'The firstName cannot be whitespace' })
    @MaxLength(MAX_NAME)
    firstName?: string;

    @ApiProperty({
        default: 'lupdatedone',
    })
    @IsOptional()
    @IsAlpha()
    @Trim()
    @MinLength(1, { message: 'The lastName cannot be whitespace' })
    @MaxLength(MAX_NAME)
    lastName?: string;

    @ApiProperty({
        type: Number,
        required: false,
        default: 1340972731,
    })
    @IsOptional()
    @IsUnix()
    @IsOlderThan(12)
    birthTime?: number;

    @ApiProperty({
        default:
            'https://upload.wikimedia.org/wikipedia/commons/thumb/3/3b/Advanced_Info_Service_logo.svg/1280px-Advanced_Info_Service_logo.svg.png',
    })
    @IsOptional()
    @Trim()
    @IsUrl()
    avartarUrl?: string;
}
