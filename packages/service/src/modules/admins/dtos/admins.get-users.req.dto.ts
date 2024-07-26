import { ApiProperty } from '@nestjs/swagger';
import {
    ArrayUnique,
    IsBoolean,
    IsEnum,
    IsInt,
    IsOptional,
    IsString,
    MaxLength,
    Min,
    Validate,
} from 'class-validator';
import { ToArray } from '../../../common/transformers/to-array.transformer';
import { Trim } from '../../../common/transformers/trim.transformer';
import { IsUnix } from '../../../common/validators/isUnix.validator';
import {
    MAX_EMAIL,
    MAX_NAME,
    MAX_PHONE,
} from '../../../shared/consts/min-max.const';
import { Role } from '../../../shared/enums/role.enum';
import { Transform } from 'class-transformer';

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

    @ApiProperty({
        type: Boolean,
        required: false,
    })
    @IsOptional()
    @Transform(({ value }) => value === 'true')
    @IsBoolean()
    isVerified?: boolean;

    // Permissions
    @ApiProperty({
        type: Boolean,
        required: false,
    })
    @IsOptional()
    @Transform(({ value }) => value === 'true')
    @IsBoolean()
    canBorrow?: boolean;

    @ApiProperty({
        type: Boolean,
        required: false,
    })
    @IsOptional()
    @Transform(({ value }) => value === 'true')
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

    @ApiProperty({ type: Number, required: false })
    @IsOptional()
    @IsInt()
    @Min(1)
    limit?: number;

    @ApiProperty({ type: Number, required: false })
    @IsOptional()
    @IsInt()
    @Min(1)
    page?: number;
}
