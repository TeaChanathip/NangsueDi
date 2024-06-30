import { ApiProperty } from '@nestjs/swagger';
import {
    ArrayUnique,
    IsBoolean,
    IsEnum,
    IsOptional,
    IsString,
    MaxLength,
    Validate,
} from 'class-validator';
import { ToArray } from 'src/common/transformers/to-array.transformer';
import { Trim } from 'src/common/transformers/trim.transformer';
import { IsUnix } from 'src/common/validators/isUnix.validator';
import {
    MAX_EMAIL,
    MAX_NAME,
    MAX_PHONE,
} from 'src/shared/consts/min-max.const';
import { Role } from 'src/shared/enums/role.enum';

export class AdminsGetUsersReqDto {
    @ApiProperty({
        type: String,
        required: false,
        maxLength: MAX_EMAIL,
    })
    @IsOptional()
    @IsString()
    @Trim()
    @MaxLength(MAX_EMAIL)
    email?: string;

    @ApiProperty({
        type: String,
        required: false,
        maxLength: MAX_PHONE,
    })
    @IsOptional()
    @IsString()
    @Trim()
    @MaxLength(MAX_PHONE)
    phone?: string;

    @ApiProperty({
        type: String,
        required: false,
        maxLength: MAX_NAME,
    })
    @IsOptional()
    @IsString()
    @Trim()
    @MaxLength(MAX_NAME)
    firstName?: string;

    @ApiProperty({
        type: String,
        required: false,
        maxLength: MAX_NAME,
    })
    @IsOptional()
    @IsString()
    @Trim()
    @MaxLength(MAX_NAME)
    lastName?: string;

    @ApiProperty({
        enum: Role,
        isArray: true,
        uniqueItems: true,
        required: false,
    })
    @IsOptional()
    @IsEnum(Role, { each: true })
    @ArrayUnique()
    @ToArray({ type: 'string' })
    roles?: Role[];

    // Permissions
    @ApiProperty({
        type: Boolean,
        required: false,
    })
    @IsOptional()
    @IsBoolean()
    canBorrow?: boolean;

    @ApiProperty({
        type: Boolean,
        required: false,
    })
    @IsOptional()
    @IsBoolean()
    canReview?: boolean;

    @ApiProperty({ type: Number, required: false })
    @IsOptional()
    @Validate(IsUnix)
    registeredBegin?: number;

    @ApiProperty({ type: Number, required: false })
    @IsOptional()
    @Validate(IsUnix)
    registeredEnd?: number;

    @ApiProperty({ type: Number, required: false })
    @IsOptional()
    @Validate(IsUnix)
    updatedBegin?: number;

    @ApiProperty({ type: Number, required: false })
    @IsOptional()
    @Validate(IsUnix)
    updatedEnd?: number;

    @ApiProperty({ type: Number, required: false })
    @IsOptional()
    @Validate(IsUnix)
    suspendedBegin?: number;

    @ApiProperty({ type: Number, required: false })
    @IsOptional()
    @Validate(IsUnix)
    suspendedEnd?: number;
}
