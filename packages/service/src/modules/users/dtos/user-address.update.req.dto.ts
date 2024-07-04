import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, MaxLength, MinLength } from 'class-validator';
import { Trim } from '../../../common/transformers/trim.transformer';
import { MAX_ADDRESS } from '../../../shared/consts/min-max.const';

export class UserAddrUpdateReqDto {
    @ApiProperty({ type: String, required: false, default: '9/11' })
    @IsOptional()
    @IsString()
    @Trim()
    @MinLength(1, { message: 'The address cannot be whitespace' })
    @MaxLength(MAX_ADDRESS)
    address?: string;

    @ApiProperty({ type: String, required: false, default: '9/11' })
    @IsOptional()
    @IsString()
    @Trim()
    @MinLength(1, { message: 'The subDistrict cannot be whitespace' })
    @MaxLength(MAX_ADDRESS)
    subDistrict?: string;

    @ApiProperty({ type: String, required: false, default: '9/11' })
    @IsOptional()
    @IsString()
    @Trim()
    @MinLength(1, { message: 'The district cannot be whitespace' })
    @MaxLength(MAX_ADDRESS)
    district?: string;

    @ApiProperty({ type: String, required: false, default: '9/11' })
    @IsOptional()
    @IsString()
    @Trim()
    @MinLength(1, { message: 'The province cannot be whitespace' })
    @MaxLength(MAX_ADDRESS)
    province?: string;

    @ApiProperty({ type: String, required: false, default: '9/11' })
    @IsOptional()
    @IsString()
    @Trim()
    @MinLength(1, { message: 'The postalCode cannot be whitespace' })
    @MaxLength(MAX_ADDRESS)
    postalCode?: string;
}
