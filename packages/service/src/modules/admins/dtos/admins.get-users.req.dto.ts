import { ApiProperty } from '@nestjs/swagger';
import {
    IsBoolean,
    IsEnum,
    IsOptional,
    IsString,
    Validate,
} from 'class-validator';
import { IsUnix } from 'src/common/validators/isUnix.validator';
import { Role } from 'src/shared/enums/role.enum';

export class AdminsGetUsersReqDto {
    @ApiProperty({ type: String, default: 'test', required: false })
    @IsOptional()
    @IsString()
    email?: string;

    @ApiProperty({ type: String, default: '09', required: false })
    @IsOptional()
    @IsString()
    phone?: string;

    @ApiProperty({ type: String, default: 'test', required: false })
    @IsOptional()
    @IsString()
    firstName?: string;

    @ApiProperty({ type: String, default: 'test', required: false })
    @IsOptional()
    @IsString()
    lastName?: string;

    @ApiProperty({
        enum: Role,
        isArray: true,
        default: [Role.USER],
        required: false,
    })
    @IsOptional()
    @IsEnum(Role, { each: true })
    roles?: Role | Role[];

    // Permissions
    @ApiProperty({
        type: Boolean,
        default: true,
        required: false,
    })
    @IsOptional()
    @IsBoolean()
    canBorrow?: boolean;

    @ApiProperty({
        type: Boolean,
        default: true,
        required: false,
    })
    @IsOptional()
    @IsBoolean()
    canReview?: boolean;

    @ApiProperty({ type: Number, default: 0, required: false })
    @IsOptional()
    @Validate(IsUnix)
    registeredBegin?: number;

    @ApiProperty({ type: Number, default: 2147483647, required: false })
    @ApiProperty()
    @IsOptional()
    @Validate(IsUnix)
    registeredEnd?: number;

    @ApiProperty({ type: Number, default: 0, required: false })
    @ApiProperty()
    @IsOptional()
    @Validate(IsUnix)
    updatedBegin?: number;

    @ApiProperty({ type: Number, default: 2147483647, required: false })
    @ApiProperty()
    @IsOptional()
    @Validate(IsUnix)
    updatedEnd?: number;

    @ApiProperty({ type: Number, default: 0, required: false })
    @ApiProperty()
    @IsOptional()
    @Validate(IsUnix)
    suspendedBegin?: number;

    @ApiProperty({ type: Number, default: 2147483647, required: false })
    @ApiProperty()
    @IsOptional()
    @Validate(IsUnix)
    suspendedEnd?: number;
}
