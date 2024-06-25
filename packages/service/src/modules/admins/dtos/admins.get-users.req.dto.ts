import { ApiProperty } from '@nestjs/swagger';
import {
    IsBoolean,
    IsEnum,
    IsOptional,
    IsString,
    MaxLength,
    MinLength,
    Validate,
} from 'class-validator';
import { Trim } from 'src/common/transformers/trim.transformer';
import { IsUnix } from 'src/common/validators/isUnix.validator';
import { MAX_EMAIL, MAX_NAME, MAX_PHONE } from 'src/shared/consts/length.const';
import { Role } from 'src/shared/enums/role.enum';

export class AdminsGetUsersReqDto {
    @ApiProperty({
        type: String,
        required: false,
        maxLength: MAX_EMAIL,
        default: 'test',
    })
    @IsOptional()
    @IsString()
    @Trim()
    @MinLength(1)
    @MaxLength(MAX_EMAIL)
    email?: string;

    @ApiProperty({
        type: String,
        required: false,
        maxLength: MAX_PHONE,
        default: '09',
    })
    @IsOptional()
    @IsString()
    @Trim()
    @MinLength(1)
    @MaxLength(MAX_PHONE)
    phone?: string;

    @ApiProperty({
        type: String,
        required: false,
        maxLength: MAX_NAME,
        default: 'test',
    })
    @IsOptional()
    @IsString()
    @Trim()
    @MinLength(1)
    @MaxLength(MAX_NAME)
    firstName?: string;

    @ApiProperty({
        type: String,
        required: false,
        maxLength: MAX_NAME,
        default: 'test',
    })
    @IsOptional()
    @IsString()
    @Trim()
    @MinLength(1)
    @MaxLength(MAX_NAME)
    lastName?: string;

    @ApiProperty({
        enum: Role,
        isArray: true,
        required: false,
        default: [Role.USER],
    })
    @IsOptional()
    @IsEnum(Role, { each: true })
    roles?: Role | Role[];

    // Permissions
    @ApiProperty({
        type: Boolean,
        required: false,
        default: true,
    })
    @IsOptional()
    @IsBoolean()
    canBorrow?: boolean;

    @ApiProperty({
        type: Boolean,
        required: false,
        default: true,
    })
    @IsOptional()
    @IsBoolean()
    canReview?: boolean;

    @ApiProperty({ type: Number, required: false, default: 0 })
    @IsOptional()
    @Validate(IsUnix)
    registeredBegin?: number;

    @ApiProperty({ type: Number, required: false, default: 2147483647 })
    @IsOptional()
    @Validate(IsUnix)
    registeredEnd?: number;

    @ApiProperty({ type: Number, required: false, default: 0 })
    @IsOptional()
    @Validate(IsUnix)
    updatedBegin?: number;

    @ApiProperty({ type: Number, required: false, default: 2147483647 })
    @IsOptional()
    @Validate(IsUnix)
    updatedEnd?: number;

    @ApiProperty({ type: Number, required: false, default: 0 })
    @IsOptional()
    @Validate(IsUnix)
    suspendedBegin?: number;

    @ApiProperty({ type: Number, required: false, default: 2147483647 })
    @IsOptional()
    @Validate(IsUnix)
    suspendedEnd?: number;
}
