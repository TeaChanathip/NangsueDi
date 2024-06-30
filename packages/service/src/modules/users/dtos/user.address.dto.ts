import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, MaxLength } from 'class-validator';
import { Trim } from 'src/common/transformers/trim.transformer';
import { MAX_ADDRESS } from 'src/shared/consts/min-max.const';

export class UserAddrDto {
    @ApiProperty({ type: String, required: true, default: 'ไม่รู้' })
    @IsString()
    @Trim()
    @IsNotEmpty()
    @MaxLength(MAX_ADDRESS)
    address: string;

    @ApiProperty({ type: String, required: true, default: 'ไม่รู้' })
    @IsString()
    @Trim()
    @IsNotEmpty()
    @MaxLength(MAX_ADDRESS)
    subDistrict: string;

    @ApiProperty({ type: String, required: true, default: 'ไม่รู้' })
    @IsString()
    @Trim()
    @IsNotEmpty()
    @MaxLength(MAX_ADDRESS)
    district: string;

    @ApiProperty({ type: String, required: true, default: 'กรุงเทพมหานคร' })
    @IsString()
    @Trim()
    @IsNotEmpty()
    @MaxLength(MAX_ADDRESS)
    province: string;

    @ApiProperty({ type: String, required: true, default: '10240' })
    @IsString()
    @Trim()
    @IsNotEmpty()
    @MaxLength(10)
    postalCode: string;
}
