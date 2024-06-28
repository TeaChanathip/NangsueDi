import { ApiProperty } from '@nestjs/swagger';
import {
    ArrayMaxSize,
    ArrayMinSize,
    ArrayNotEmpty,
    IsAlpha,
    IsArray,
    IsEmail,
    IsMobilePhone,
    IsNotEmpty,
    IsOptional,
    IsString,
    Matches,
    MaxLength,
    Min,
    MinLength,
} from 'class-validator';
import { Trim } from 'src/common/transformers/trim.transformer';
import { IsUnix } from 'src/common/validators/isUnix.validator';
import { UserAddressDto } from 'src/modules/users/dtos/user.address.dto';
import {
    MAX_ADDRESS,
    MAX_NAME,
    MAX_PWD,
    MIN_PWD,
} from 'src/shared/consts/min-max.const';
import { getCurrentUnix } from 'src/shared/utils/getCurrentUnix';

export class AuthRegisterReqDto {
    @ApiProperty({
        default: 'test1@test.com',
    })
    @IsNotEmpty()
    @IsEmail()
    email: string;

    @ApiProperty({
        default: '0611111111',
    })
    @IsNotEmpty()
    @IsMobilePhone('th-TH', null, {
        message: 'Phone number format is incorrect',
    })
    @Matches(/^0[0-9]*$/, { message: 'Phone number must start with 0' })
    phone: string;

    @ApiProperty({
        type: UserAddressDto,
        isArray: true,
        required: true,
    })
    @IsArray()
    @ArrayNotEmpty()
    @ArrayMaxSize(5)
    addresses: UserAddressDto[];

    @ApiProperty({
        default: '111111',
    })
    @IsNotEmpty()
    @IsString()
    @MinLength(MIN_PWD)
    @MaxLength(MAX_PWD)
    password: string;

    @ApiProperty({
        default: 'firstone',
    })
    @IsAlpha()
    @Trim()
    @IsNotEmpty()
    @MaxLength(MAX_NAME)
    firstName: string;

    @ApiProperty({
        default: 'lastone',
    })
    @IsOptional()
    @IsAlpha()
    @Trim()
    @MinLength(1, { message: 'The lastName cannot be whitespace' })
    @MaxLength(MAX_NAME)
    lastName?: string;

    @ApiProperty({
        type: Number,
        required: true,
        default: 100000,
    })
    @IsNotEmpty()
    @IsUnix()
    @Min(getCurrentUnix() - 378683425, {
        message: 'The age must be at least 12 years',
    })
    birthDate: number;
}
